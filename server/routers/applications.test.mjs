import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import Module, { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const { ApplicationStatus } = require("../../app/generated/prisma");

// Load the real tRPC router while replacing only the database dependency.
// TypeScript is already a project dependency; no test runner or database is needed.
function loadTypeScript(path, overrides = {}) {
  const filename = fileURLToPath(new URL(path, import.meta.url));
  const source = readFileSync(filename, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const mod = new Module(filename);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(filename.substring(0, filename.lastIndexOf("/")));
  const originalRequire = mod.require.bind(mod);
  mod.require = (id) => Object.hasOwn(overrides, id) ? overrides[id] : originalRequire(id);
  mod._compile(compiled, filename);
  return mod.exports;
}

const calls = [];
let users;
let applications;
let updateError;
const prisma = {
  user: {
    async findUnique(args) {
      calls.push(["user.findUnique", args]);
      return users.find((user) => user.kindeId === args.where.kindeId) ?? null;
    },
  },
  application: {
    async update(args) {
      calls.push(["application.update", args]);
      if (updateError) throw updateError;
      const app = applications.find((item) => item.id === args.where.id && item.userId === args.where.userId);
      if (!app) throw { code: "P2025" };
      Object.assign(app, args.data);
      return { ...app };
    },
  },
};
const trpc = loadTypeScript("../trpc.ts");
const { applicationsRouter } = loadTypeScript("./applications.ts", {
  "../trpc": trpc,
  "@/lib/db": { prisma },
  "@/app/generated/prisma": { ApplicationStatus },
});
const caller = (user = { id: "kinde-a" }) => applicationsRouter.createCaller({ user });

beforeEach(() => {
  calls.length = 0;
  updateError = null;
  users = [{ id: "local-a", kindeId: "kinde-a" }];
  applications = [
    { id: "mine", userId: "local-a", status: "APPLIED", jobTitle: "Engineer" },
    { id: "theirs", userId: "local-b", status: "APPLIED", jobTitle: "Designer" },
  ];
});

test("updates and returns only the owner's status using the local user id", async () => {
  const result = await caller().updateStatus({ id: "mine", status: "INTERVIEW_DONE" });
  assert.deepEqual(result, { id: "mine", userId: "local-a", status: "INTERVIEW_DONE", jobTitle: "Engineer" });
  assert.deepEqual(calls, [
    ["user.findUnique", { where: { kindeId: "kinde-a" } }],
    ["application.update", { where: { id: "mine", userId: "local-a" }, data: { status: "INTERVIEW_DONE" } }],
  ]);
  assert.equal(applications[1].status, "APPLIED");
});

test("missing and other users' applications both return NOT_FOUND without changes", async () => {
  for (const id of ["missing", "theirs"]) {
    await assert.rejects(caller().updateStatus({ id, status: "REJECTED" }), { code: "NOT_FOUND" });
  }
  assert.deepEqual(applications.map((app) => app.status), ["APPLIED", "APPLIED"]);
});

test("rejects unauthenticated callers and missing local users", async () => {
  await assert.rejects(caller(null).updateStatus({ id: "mine", status: "REJECTED" }), { code: "UNAUTHORIZED" });
  assert.deepEqual(calls, []);
  users = [];
  await assert.rejects(caller().updateStatus({ id: "mine", status: "REJECTED" }), { code: "UNAUTHORIZED" });
  assert.deepEqual(calls.map(([name]) => name), ["user.findUnique"]);
});

test("validates id and every ApplicationStatus", async () => {
  for (const status of Object.values(ApplicationStatus)) {
    assert.equal((await caller().updateStatus({ id: "mine", status })).status, status);
  }
  calls.length = 0;
  for (const input of [{ id: "mine", status: "INVALID" }, { id: 123, status: "APPLIED" }]) {
    await assert.rejects(caller().updateStatus(input), { code: "BAD_REQUEST" });
  }
  assert.deepEqual(calls, []);
});

test("logs unexpected update errors and returns a safe internal error", async () => {
  updateError = new Error("database secret");
  const original = console.error;
  const logged = [];
  console.error = (...args) => logged.push(args);
  try {
    await assert.rejects(caller().updateStatus({ id: "mine", status: "REJECTED" }), {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong. Please try again.",
    });
    assert.deepEqual(logged, [["[applications.updateStatus]", updateError]]);
    assert.equal(applications[0].status, "APPLIED");
  } finally {
    console.error = original;
  }
});
