import axios from '@/axiosInstance';
import type { CreateMessagePayload, Message } from 'types';

const createMessage = async (
  payload: CreateMessagePayload
): Promise<Message> => {
  const { data } = await axios.post('/messages', payload);

  return data;
};

export default {
  createMessage,
};
