import { Express } from 'express';
import helloWorld from '@/api/hello_world';

export const API_PATH = '/api';

export default (app: Express) => {
  [helloWorld].forEach((route) => app.use(API_PATH, route));
};
