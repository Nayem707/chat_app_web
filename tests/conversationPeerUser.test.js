import test from "node:test";
import assert from "node:assert/strict";

import { getConversationPeerUser } from "../src/features/groups/groupUtils.js";

test("getConversationPeerUser resolves the active direct-chat peer from membersMeta", () => {
  const activeConversation = {
    id: "conv_1",
    type: "DIRECT",
    members: ["user_1", "user_2"],
    membersMeta: [
      { id: "user_1", userId: "user_1", name: "Me", email: "me@example.com" },
      {
        id: "user_2",
        userId: "user_2",
        name: "Alice",
        email: "alice@example.com",
      },
    ],
  };

  const peer = getConversationPeerUser({
    conversation: activeConversation,
    currentUserId: "user_1",
    users: [{ id: "user_2", name: "Alice", email: "alice@example.com" }],
  });

  assert.deepEqual(peer, {
    id: "user_2",
    userId: "user_2",
    name: "Alice",
    email: "alice@example.com",
  });
});

test("getConversationPeerUser falls back to the full users list when membersMeta is absent", () => {
  const activeConversation = {
    id: "conv_2",
    type: "DIRECT",
    members: ["user_9", "user_3"],
  };

  const peer = getConversationPeerUser({
    conversation: activeConversation,
    currentUserId: "user_9",
    users: [
      { id: "user_3", name: "Bob", email: "bob@example.com" },
      { id: "user_4", name: "Other", email: "other@example.com" },
    ],
  });

  assert.deepEqual(peer, {
    id: "user_3",
    userId: "user_3",
    name: "Bob",
    email: "bob@example.com",
  });
});
