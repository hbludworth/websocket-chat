import { Express } from 'express';
import register from '@/api/register';
import users from '@/api/users';
import profile from '@/api/profile';

export const API_PATH = '/api';

export default (app: Express) => {
  [register, users, profile].forEach((route) => app.use(API_PATH, route));
};
