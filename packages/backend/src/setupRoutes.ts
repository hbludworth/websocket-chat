import { Express } from 'express';
import register from '@/api/register';
import users from '@/api/users';
import profile from '@/api/profile';
import threads from '@/api/threads';
import messages from '@/api/messages';

export const API_PATH = '/api';

export default (app: Express) => {
  [register, users, profile, threads, messages].forEach((route) =>
    app.use(API_PATH, route)
  );
};
