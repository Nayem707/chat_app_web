export const normalizeUserList = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.users)) return value.users;
  return [];
};

export const getConversationPeerUser = ({
  conversation,
  currentUserId,
  users = [],
}) => {
  if (!conversation) return null;

  const members = Array.isArray(conversation.membersMeta)
    ? conversation.membersMeta
    : Array.isArray(conversation.members)
      ? conversation.members.map((member) => {
          if (typeof member === "object" && member !== null) return member;
          return { id: member, userId: member };
        })
      : [];

  const peerMember = members.find((member) => {
    const memberId = member?.userId ?? member?.id;
    return typeof memberId === "string" && memberId !== currentUserId;
  });

  if (peerMember) {
    const peerId = peerMember.userId ?? peerMember.id;
    const fromMembers = users.find((user) => user?.id === peerId);
    if (fromMembers) {
      return {
        ...fromMembers,
        id: fromMembers.id ?? peerId,
        userId: fromMembers.userId ?? fromMembers.id ?? peerId,
      };
    }

    const shapedPeer = {
      id: peerId,
      userId: peerId,
      name: peerMember.name || peerMember.displayName || "Unknown user",
      email: peerMember.email || "",
      avatar: peerMember.avatar || "",
      status: peerMember.status || "offline",
      bio: peerMember.bio || "",
      location: peerMember.location || "",
      phone: peerMember.phone || "",
    };

    return shapedPeer;
  }

  if (conversation.type === "DIRECT") {
    const peerId = conversation.members?.find((id) => id !== currentUserId);
    if (!peerId) return null;
    return users.find((user) => user?.id === peerId) || null;
  }

  return null;
};
