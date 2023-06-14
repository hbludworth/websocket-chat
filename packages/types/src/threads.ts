import { Message } from './messages';

export interface ThreadRow {
  uuid: string;
  userUuid1: string;
  userUuid2: string;
}

export interface Thread extends ThreadRow {
  messages: Message[];
}
