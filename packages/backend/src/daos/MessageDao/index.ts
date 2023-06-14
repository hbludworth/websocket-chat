import { Message } from 'types';
import mongodb from '@/connection';

class MessageDao {
  public async getMessagesByThreadUuid(threadUuid: string): Promise<Message[]> {
    const messages: Message[] = await mongodb
      .collection<Message>('message')
      .find({ threadUuid })
      .toArray();

    return messages.sort(
      (a, b) => a.createdOn.getTime() - b.createdOn.getTime()
    );
  }

  public async createMessage(
    uuid: string,
    threadUuid: string,
    userUuid: string,
    content: string,
    createdOn: Date
  ): Promise<Message> {
    const message: Message = {
      uuid,
      threadUuid,
      userUuid,
      content,
      createdOn,
    };

    await mongodb.collection<Message>('message').insertOne(message);

    return message;
  }
}

export default new MessageDao();
