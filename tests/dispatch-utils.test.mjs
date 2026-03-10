import test from "node:test";
import assert from "node:assert/strict";

import { compareDispatchPublishedAt, slugifyDispatchTitle } from "../src/utils/dispatch.js";

test("slugifyDispatchTitle normalizes titles to kebab-case", () => {
  assert.equal(
    slugifyDispatchTitle("So this site website page call it whatever, will be my laboratory work"),
    "so-this-site-website-page-call-it-whatever-will-be-my-laboratory-work",
  );
  assert.equal(slugifyDispatchTitle("  Hi there!  "), "hi-there");
});

test("compareDispatchPublishedAt sorts by date descending, then time descending", () => {
  const entries = [
    { id: "older", date: "2025-04-08", time: "11:00" },
    { id: "same-day-earlier", date: "2025-06-13", time: "09:15" },
    { id: "newer", date: "2025-12-05", time: "22:00" },
    { id: "same-day-later", date: "2025-06-13", time: "11:00" },
  ];

  entries.sort(compareDispatchPublishedAt);

  assert.deepEqual(entries.map((entry) => entry.id), [
    "newer",
    "same-day-later",
    "same-day-earlier",
    "older",
  ]);
});
