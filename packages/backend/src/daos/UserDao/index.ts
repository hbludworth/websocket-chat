import { User } from 'types';
import mongodb from '@/connection';

class UserDao {
  async getUserByUuid(uuid: string): Promise<User> {
    const user: User | null = await mongodb
      .collection<User>('user')
      .findOne({ uuid });

    if (!user) {
      throw new Error(`User with uuid ${uuid} not found`);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user: User | null = await mongodb
      .collection<User>('user')
      .findOne({ email });

    if (!user) {
      throw new Error(`User with uuid ${email} not found`);
    }

    return user;
  }

  async emailExists(email: string): Promise<boolean> {
    const user: User | null = await mongodb
      .collection<User>('user')
      .findOne({ email });

    return !!user;
  }

  async createUser(
    uuid: string,
    firstName: string,
    lastName: string,
    email: string
  ): Promise<void> {
    const user: User = {
      uuid,
      firstName,
      lastName,
      email,
      createdOn: new Date(),
    };

    await mongodb.collection<User>('user').insertOne(user);
  }

  async updateProfile(
    uuid: string,
    firstName: string,
    lastName: string,
    email: string
  ): Promise<void> {
    await mongodb
      .collection<User>('user')
      .updateOne({ uuid }, { $set: { firstName, lastName, email } });
  }
}

export default new UserDao();
