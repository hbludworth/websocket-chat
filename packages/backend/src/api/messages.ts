import { HttpBadRequest, HttpInternalError } from '@/exceptions';
import authenticatedRoute from '@/middleware/router/authenticatedRoute';
import express from 'express';
import { CreateMessagePayload } from 'types';
import sl from '@/serviceLocator';

const router = express.Router();

router.route('/messages').post(authenticatedRoute, async (req, res, next) => {
  try {
    const MessageDao = sl.get('MessageDao');
    const WebSocket = sl.get('WebSocket');
    const ThreadDao = sl.get('ThreadDao');

    const userUuid = req.user!.uuid;

    const { threadUuid, message }: CreateMessagePayload = req.body;

    const messageRow = await MessageDao.createMessage(
      threadUuid,
      userUuid,
      message
    );

    const usersOfThread = await ThreadDao.getUsersOfThread(threadUuid);
    const recipientUserUuid = usersOfThread.find((u) => u !== userUuid);

    if (!recipientUserUuid) {
      next(new HttpBadRequest('Thread does not exist'));
      return;
    }

    WebSocket.sendToUser(recipientUserUuid, {
      type: 'NEW_MESSAGE',
      body: messageRow,
    });

    res.json(messageRow);
  } catch (err) {
    next(new HttpInternalError(err as string));
  }
});

export default router;
