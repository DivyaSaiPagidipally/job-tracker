import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import Module, { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const { ApplicationStatus } = require("../../app/generated/prisma");
const filename = fileURLToPath(new URL("./ApplicationList.tsx", import.meta.url));
const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;

let state, index, items, failedPage, loadingPage, calls, effects, toasts;
const Table = () => null;
const Skeleton = () => null;
const Pagination = () => null;
const react = {
  useState(initial) {
    const slot = index++;
    if (!(slot in state)) state[slot] = initial;
    return [state[slot], (value) => { state[slot] = value; }];
  },
  useEffect(effect) { effects.push(effect); },
};
function query(input) {
  calls.push(input);
  if (input.page === failedPage) return { error: new Error("secret") };
  if (input.page === loadingPage) return { isLoading: true };
  return { data: { items: items.slice((input.page - 1) * input.limit, input.page * input.limit), totalCount: items.length } };
}
const trpc = {
  application: { list: { useQuery(input, options) { return options.enabled ? query(input) : {}; } } },
  useQueries(callback) {
    return callback({ application: { list: (input) => input } }).map(query);
  },
};
const mod = new Module(filename);
mod.filename = filename;
mod.paths = Module._nodeModulePaths(filename.substring(0, filename.lastIndexOf("/")));
const originalRequire = mod.require.bind(mod);
const overrides = {
  react,
  "react-hot-toast": { __esModule: true, default: { error: (message) => toasts.push(message) } },
  "next/link": { __esModule: true, default: () => null },
  "@/app/generated/prisma": { ApplicationStatus },
  "@/lib/trpc": { trpc },
  "./ApplicationTable": { ApplicationTable: Table },
  "./ApplicationTableSkeleton": { ApplicationTableSkeleton: Skeleton },
  "./Pagination": { Pagination },
};
mod.require = (id) => Object.hasOwn(overrides, id) ? overrides[id] : originalRequire(id);
mod._compile(compiled, filename);

function render() { index = 0; effects = []; calls = []; return mod.exports.ApplicationList(); }
function nodes(element) {
  if (!element || typeof element !== "object") return [];
  return [element, ...[element.props?.children].flat(Infinity).flatMap(nodes)];
}
function find(tree, type) { return nodes(tree).find((node) => node.type === type); }
function change(tree, value) { find(tree, "select").props.onChange({ target: { value } }); }

beforeEach(() => {
  state = []; failedPage = 0; loadingPage = 0; toasts = [];
  items = Array.from({ length: 125 }, (_, i) => ({ id: String(i), status: i % 2 ? "APPLIED" : "REJECTED" }));
});

test("dropdown is labelled, styled, above the table and contains every status", () => {
  const tree = render();
  const all = nodes(tree);
  const select = find(tree, "select");
  assert.equal(find(tree, "label").props.htmlFor, select.props.id);
  assert.match(select.props.className, /dark:bg-zinc-900/);
  assert.ok(all.indexOf(select) < all.indexOf(find(tree, Table)));
  const options = nodes(select).filter((node) => node.type === "option");
  assert.equal(options[0].props.children, "All statuses");
  assert.deepEqual(options.map((option) => option.props.value), ["", ...Object.values(ApplicationStatus)]);
});

test("status filters all batches, paginates matches, and all statuses restores the list", () => {
  let tree = render();
  find(tree, Pagination).props.onPageChange(2);
  // Pagination scroll is a browser API.
  change(render(), "REJECTED");
  tree = render();
  assert.deepEqual(calls, [{ page: 1, limit: 100 }, { page: 2, limit: 100 }]);
  assert.equal(find(tree, Pagination).props.currentPage, 1);
  assert.equal(find(tree, Pagination).props.totalPages, 4);
  assert.deepEqual(find(tree, Table).props.applications, items.filter((item) => item.status === "REJECTED").slice(0, 20));
  state[0] = 4;
  tree = render();
  assert.deepEqual(find(tree, Table).props.applications, items.filter((item) => item.status === "REJECTED").slice(60));
  change(tree, "");
  tree = render();
  assert.equal(find(tree, Pagination).props.currentPage, 1);
  assert.deepEqual(find(tree, Table).props.applications, items.slice(0, 20));
  state[0] = 7;
  assert.deepEqual(find(render(), Table).props.applications, items.slice(120));
});

test("each status selection returns only its matching applications", () => {
  items = Object.values(ApplicationStatus).map((status, id) => ({ id: String(id), status }));
  for (const status of Object.values(ApplicationStatus)) {
    change(render(), status);
    assert.deepEqual(find(render(), Table).props.applications, items.filter((item) => item.status === status));
  }
});

test("loading and empty filtered results do not show stale rows", () => {
  change(render(), "ACCEPTED");
  loadingPage = 2;
  let tree = render();
  assert.ok(find(tree, Skeleton));
  assert.equal(find(tree, Table), undefined);
  loadingPage = 0;
  tree = render();
  assert.ok(nodes(tree).some((node) => node.props?.children === "No applications match this status."));
  assert.equal(find(tree, Table), undefined);
});

test("batch failure logs and shows a safe error without partial results", () => {
  change(render(), "APPLIED");
  for (const page of [1, 2]) {
    failedPage = page;
    const tree = render();
    const original = console.error;
    const logged = [];
    console.error = (...args) => logged.push(args);
    try { effects.forEach((effect) => effect()); } finally { console.error = original; }
    assert.equal(logged[0][0], "[ApplicationList.filter]");
    assert.equal(toasts.at(-1), "Could not filter applications. Please try again.");
    assert.equal(find(tree, Table), undefined);
    assert.ok(nodes(tree).some((node) => node.props?.children === "Could not filter applications. Please try again."));
  }
  failedPage = 0;
  change(render(), "");
  assert.deepEqual(find(render(), Table).props.applications, items.slice(0, 20));
});

globalThis.window = { scrollTo() {} };
