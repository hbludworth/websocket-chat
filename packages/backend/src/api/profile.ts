import express from 'express';
import { HttpInternalError } from '@/exceptions';
import sl from '@/serviceLocator';
import { UpdateProfilePayload } from 'types';
import authenticatedRoute from '@/middleware/router/authenticatedRoute';

const router = express.Router();

router.route('/profile').patch(authenticatedRoute, async (req, res, next) => {
  try {
    const UserDao = sl.get('UserDao');

    const { uuid } = req.user!;
    const payload: UpdateProfilePayload = req.body;

    await UserDao.updateProfile(
      uuid,
      payload.firstName,
      payload.lastName,
      payload.email,
      payload.isAdmin
    );

    res.status(204).end();
  } catch (err) {
    next(new HttpInternalError(err as string));
  }
});

export default router;
