import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

// Load the TSX components with the project's TypeScript compiler, without a test runner dependency.
const require = createRequire(import.meta.url);
require.extensions[".tsx"] = (module, filename) => {
  const source = readFileSync(filename, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    fileName: filename,
  });
  module._compile(outputText, filename);
};
const { ApplicationTable } = require("./ApplicationTable.tsx");

const application = {
  id: "1",
  companyName: "Example",
  jobTitle: "Engineer",
  jobUrl: null,
  status: "APPLIED",
  dateApplied: "2024-01-01",
  location: null,
  salaryMin: null,
  salaryMax: null,
};

function renderRows(applications) {
  const html = renderToStaticMarkup(React.createElement(ApplicationTable, { applications }));
  const headers = [...html.matchAll(/<th[^>]*>(.*?)<\/th>/g)].map((match) => match[1]);
  const rows = [...html.matchAll(/<tr[^>]*>(.*?)<\/tr>/g)].slice(1).map((row) =>
    [...row[1].matchAll(/<td class="([^"]*)">(.*?)<\/td>/g)].map((cell) => ({
      className: cell[1],
      content: cell[2],
    }))
  );
  return { headers, rows };
}

test("job URL column renders the URL as a secure new-tab link", () => {
  const url = "https://example.com/jobs/123?source=tracker&role=engineer";
  const { headers, rows } = renderRows([{ ...application, jobUrl: url }]);
  const cell = rows[0][headers.indexOf("Job URL")];
  assert.ok(cell);
  assert.match(cell.content, /^<a\s/);
  assert.match(cell.content, /href="https:\/\/example\.com\/jobs\/123\?source=tracker&amp;role=engineer"/);
  assert.match(cell.content, /target="_blank"/);
  assert.match(cell.content, /rel="noopener noreferrer"/);
  assert.match(cell.content, />https:\/\/example\.com\/jobs\/123\?source=tracker&amp;role=engineer<\/a>$/);
});

test("null job URL renders an em dash styled like an empty location", () => {
  const { headers, rows } = renderRows([application]);
  const urlCell = rows[0][headers.indexOf("Job URL")];
  const locationCell = rows[0][headers.indexOf("Location")];
  assert.ok(urlCell);
  assert.deepEqual(urlCell, locationCell);
  assert.equal(urlCell.content, "—");
});
