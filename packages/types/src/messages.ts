export interface Message {
  uuid: string;
  threadUuid: string;
  userUuid: string;
  content: string;
  createdOn: Date;
}

export interface CreateMessagePayload {
  threadUuid: string;
  message: string;
}
