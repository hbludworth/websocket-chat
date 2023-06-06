import { type User } from './users';

export interface RegisterResponse {
  user: User;
  firebaseToken: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
