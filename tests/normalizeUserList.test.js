import test from "node:test";
import assert from "node:assert/strict";

import { normalizeUserList } from "../src/features/groups/groupUtils.js";

test("normalizeUserList handles api-wrapped and plain arrays", () => {
  assert.deepEqual(normalizeUserList([{ id: "u1", name: "Alice" }]), [
    { id: "u1", name: "Alice" },
  ]);

  assert.deepEqual(
    normalizeUserList({ success: true, data: [{ id: "u2", name: "Bob" }] }),
    [{ id: "u2", name: "Bob" }],
  );

  assert.deepEqual(normalizeUserList({ success: true }), []);
  assert.deepEqual(normalizeUserList(null), []);
  assert.deepEqual(normalizeUserList(undefined), []);
});
