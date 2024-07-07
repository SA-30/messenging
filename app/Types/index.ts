import { Conversation, Message, User } from "@prisma/client";

export type FullMessageType = Message & {
  sender: User;
  seen: User[];
  isOwn?: boolean;
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
};
