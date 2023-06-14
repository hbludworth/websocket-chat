import { Thread, ThreadRow } from 'types';
import mongodb from '@/connection';
import sl from '@/serviceLocator';

class ThreadDao {
  private async getThreadRowByUuid(uuid: string): Promise<ThreadRow | null> {
    const thread: ThreadRow | null = await mongodb
      .collection<ThreadRow>('thread')
      .findOne({ uuid });

    return thread;
  }

  private async getThreadByUuid(uuid: string): Promise<Thread | null> {
    const MessageDao = sl.get('MessageDao');

    const threadRow = await this.getThreadRowByUuid(uuid);
    if (!threadRow) {
      return null;
    }

    const messages = await MessageDao.getMessagesByThreadUuid(uuid);

    const thread: Thread = {
      ...threadRow,
      messages,
    };

    return thread;
  }

  private async getThreadRowsOfUser(userUuid: string): Promise<ThreadRow[]> {
    const rows: ThreadRow[] = await mongodb
      .collection<ThreadRow>('thread')
      .find({ $or: [{ userUuid1: userUuid }, { userUuid2: userUuid }] })
      .toArray();

    return rows;
  }

  public async getThreadsOfUser(userUuid: string): Promise<Thread[]> {
    const rows = await this.getThreadRowsOfUser(userUuid);

    const threads: Thread[] = (
      await Promise.all(rows.map((row) => this.getThreadByUuid(row.uuid)))
    ).filter((thread): thread is Thread => !!thread);

    return threads;
  }

  public async createThread(
    uuid: string,
    userUuid1: string,
    userUuid2: string
  ): Promise<ThreadRow> {
    const thread: ThreadRow = {
      uuid,
      userUuid1,
      userUuid2,
    };

    await mongodb.collection<ThreadRow>('thread').insertOne(thread);

    return thread;
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
