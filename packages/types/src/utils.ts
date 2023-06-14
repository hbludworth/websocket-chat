import { Message } from './messages';
import { Thread } from './threads';

export type WebSocketPayload = NewThreadPayload | NewMessagePayload;

export interface NewThreadPayload {
  type: 'newThread';
  body: Thread;
}

export interface NewMessagePayload {
  type: 'newMessage';
  body: Message;
}
