import express from 'express';
import authenticatedRoute from '@/middleware/router/authenticatedRoute';
import { HttpInternalError, HttpBadRequest, HttpForbidden } from '@/exceptions';
import sl from '@/serviceLocator';

const router = express.Router();

router.route('/users/:uuid').get(authenticatedRoute, async (req, res, next) => {
  try {
    const UserDao = sl.get('UserDao');

    const { uuid } = req.params;

    const user = await UserDao.getUserByUuid(uuid);

    res.json(user);
  } catch (err) {
    next(new HttpInternalError(err as string));
  }
});

router
  .route('/users/email/:email')
  .get(authenticatedRoute, async (req, res, next) => {
    try {
      const UserDao = sl.get('UserDao');

      const { email } = req.params;

      const user = await UserDao.getUserByEmail(email);

      res.json(user);
    } catch (err) {
      next(new HttpInternalError(err as string));
    }
  });

export default router;
