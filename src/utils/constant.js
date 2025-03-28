export const codeRevokeRef = { current: null };

export const API_STATUS = {
  SUCCESS: "success",
  ERROR: "error",
  LOADING: "loading",
};

export const SOCKET_EVENTS = {
  ACCEPT_FRIEND: "accept-friend",
  SEND_FRIEND_INVITE: "send-friend-invite",
  DELETED_FRIEND_INVITE: "deleted-friend-invite",
  DELETED_INVITE_WAS_SEND: "deleted-invite-was-send",
  DELETED_FRIEND: "deleted-friend",
  REVOKE_TOKEN: "revoke-token",
  //Join socket user id
  JOIN_USER: "join",
  //Chat
  SEND_MESSAGE: "send-message",
  RECEIVE_MESSAGE: "receive-message",
  JOIN_ROOM: "join-conversation",
  LEAVE_ROOM: "leave-conversation",
  TYPING: "typing",
  STOP_TYPING: "not-typing",
};
