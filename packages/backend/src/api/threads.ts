import express from 'express';
import authenticatedRoute from '@/middleware/router/authenticatedRoute';
import { HttpInternalError } from '@/exceptions';
import sl from '@/serviceLocator';

const router = express.Router();

router.route('/threads').get(authenticatedRoute, async (req, res, next) => {
  try {
    const ThreadDao = sl.get('ThreadDao');

    const userUuid = req.user!.uuid;

    const threads = await ThreadDao.getThreadsOfUser(userUuid);

    res.json(threads);
  } catch (err) {
    next(new HttpInternalError(err as string));
  }
});

export default router;
