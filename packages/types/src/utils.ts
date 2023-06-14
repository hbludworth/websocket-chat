import { type Message } from './messages';
import { type Thread } from './threads';

export type WebSocketPayload = NewThreadPayload | NewMessagePayload;

export interface NewThreadPayload {
  type: 'NEW_THREAD';
  body: Thread;
}

export interface NewMessagePayload {
  type: 'NEW_MESSAGE';
  body: Message;
}
