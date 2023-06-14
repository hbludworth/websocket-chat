import { Message } from 'types';
import mongodb from '@/connection';
import { v4 } from 'uuid';

class MessageDao {
  public async getMessagesByThreadUuid(threadUuid: string): Promise<Message[]> {
    const messages: Message[] = await mongodb
      .collection<Message>('message')
      .find({ threadUuid })
      .toArray();

    return messages.sort(
      (a, b) =>
        new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime()
    );
  }

  public async createMessage(
    threadUuid: string,
    userUuid: string,
    content: string
  ): Promise<Message> {
    const message: Message = {
      uuid: v4(),
      threadUuid,
      userUuid,
      content,
      createdOn: new Date(),
    };

    await mongodb.collection<Message>('message').insertOne(message);

    return message;
  }
}

export default new MessageDao();
