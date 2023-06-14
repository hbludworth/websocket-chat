import axios from '@/axiosInstance';
import type { CreateThreadPayload, Thread } from 'types';

const getUserThreads = async (): Promise<Thread[]> => {
  const { data } = await axios.get('/threads');

  return data;
};

const createThread = async (payload: CreateThreadPayload): Promise<Thread> => {
  const { data } = await axios.post('/threads', payload);

  return data;
};

export default {
  getUserThreads,
  createThread,
};
