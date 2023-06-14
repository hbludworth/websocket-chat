import axios from '@/axiosInstance';
import type { Thread } from 'types';

const getUserThreads = async (): Promise<Thread[]> => {
  const { data } = await axios.get('/threads');

  return data;
};

export default {
  getUserThreads,
};
