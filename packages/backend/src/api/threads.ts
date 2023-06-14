import express from 'express';
import authenticatedRoute from '@/middleware/router/authenticatedRoute';
import { HttpInternalError } from '@/exceptions';
import sl from '@/serviceLocator';
import { CreateThreadPayload, Thread } from 'types';

const router = express.Router();

router
  .route('/threads')
  .get(authenticatedRoute, async (req, res, next) => {
    try {
      const ThreadDao = sl.get('ThreadDao');

      const userUuid = req.user!.uuid;

      const threads = await ThreadDao.getThreadsOfUser(userUuid);

      res.json(threads);
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  })
  .post(authenticatedRoute, async (req, res, next) => {
    try {
      const ThreadDao = sl.get('ThreadDao');
      const MessageDao = sl.get('MessageDao');
      const UserDao = sl.get('UserDao');
      const WebSocket = sl.get('WebSocket');

      const userUuid = req.user!.uuid;

      const { recipientUserUuid, message }: CreateThreadPayload = req.body;

      const threadRow = await ThreadDao.createThread(
        userUuid,
        recipientUserUuid
      );

      const messageRow = await MessageDao.createMessage(
        threadRow.uuid,
        userUuid,
        message
      );

      const recipientUser = await UserDao.getUserByUuid(recipientUserUuid);

      const newThread: Thread = {
        ...threadRow,
        messages: [messageRow],
        user1: req.user!,
        user2: recipientUser,
      };

      WebSocket.sendToUser(recipientUserUuid, {
        type: 'NEW_THREAD',
        body: newThread,
      });

      res.json(newThread);
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  });

export default router;
