import { Message } from './messages';
import { User } from './users';

export interface ThreadRow {
  uuid: string;
  userUuid1: string;
  userUuid2: string;
}

export interface Thread extends ThreadRow {
  messages: Message[];
  user1: User;
  user2: User;
}

export interface CreateThreadPayload {
  recipientUserUuid: string;
  message: string;
}
