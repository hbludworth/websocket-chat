import { Thread, ThreadRow } from 'types';
import mongodb from '@/connection';
import sl from '@/serviceLocator';
import { v4 } from 'uuid';

class ThreadDao {
  private async getThreadRowsOfUser(userUuid: string): Promise<ThreadRow[]> {
    const rows: ThreadRow[] = await mongodb
      .collection<ThreadRow>('thread')
      .find({ $or: [{ userUuid1: userUuid }, { userUuid2: userUuid }] })
      .toArray();

    return rows;
  }

  public async getThreadsOfUser(userUuid: string): Promise<Thread[]> {
    const MessageDao = sl.get('MessageDao');
    const UserDao = sl.get('UserDao');

    const threadRows = await this.getThreadRowsOfUser(userUuid);

    const messages = await Promise.all(
      threadRows.map((row) => MessageDao.getMessagesByThreadUuid(row.uuid))
    );

    const users1 = await Promise.all(
      threadRows.map((row) => UserDao.getUserByUuid(row.userUuid1))
    );

    const users2 = await Promise.all(
      threadRows.map((row) => UserDao.getUserByUuid(row.userUuid2))
    );

    const threads: Thread[] = threadRows.map((row, idx) => ({
      ...row,
      messages: messages[idx],
      user1: users1[idx],
      user2: users2[idx],
    }));

    const sortedThreads = threads.sort((a, b) => {
      if (a.messages.length === 0) {
        return 1;
      }

      if (b.messages.length === 0) {
        return -1;
      }

      const aLastMessage = a.messages[a.messages.length - 1];
      const bLastMessage = b.messages[b.messages.length - 1];

      return (
        new Date(bLastMessage.createdOn).getTime() -
        new Date(aLastMessage.createdOn).getTime()
      );
    });

    return sortedThreads;
  }

  public async createThread(
    userUuid1: string,
    userUuid2: string
  ): Promise<ThreadRow> {
    const threadRow: ThreadRow = {
      uuid: v4(),
      userUuid1,
      userUuid2,
    };

    await mongodb.collection<ThreadRow>('thread').insertOne(threadRow);

    return threadRow;
  }

  public async getUsersOfThread(threadUuid: string): Promise<string[]> {
    const row: ThreadRow | null = await mongodb
      .collection<ThreadRow>('thread')
      .findOne({ uuid: threadUuid });

    if (!row) {
      return [];
    }

    return [row.userUuid1, row.userUuid2];
  }
}

export default new ThreadDao();
