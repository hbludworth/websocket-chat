import { User, UpdateProfilePayload } from 'types';
import mongodb from '@/connection';

class UserDao {
  async getUserByUuid(uuid: string): Promise<User | null> {
    const user: User | null = await mongodb
      .collection<User>('user')
      .findOne({ uuid });

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
      isAdmin: false,
      createdOn: new Date(),
    };

    await mongodb.collection<User>('user').insertOne(user);
  }

  async updateProfile(
    uuid: string,
    { email, firstName, lastName }: Required<UpdateProfilePayload>
  ): Promise<void> {
    await mongodb
      .collection<User>('user')
      .updateOne({ uuid }, { $set: { email, firstName, lastName } });
  }
}

export default new UserDao();
