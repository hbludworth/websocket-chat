import express from 'express';
import { HttpInternalError } from '@/exceptions';
import sl from '@/serviceLocator';
import { UpdateProfilePayload } from 'types';
import authenticatedRoute from '@/middleware/router/authenticatedRoute';

const router = express.Router();

router.route('/profile').patch(authenticatedRoute, async (req, res, next) => {
  try {
    const UserDao = sl.get('UserDao');

    const { uuid, email, firstName, lastName } = req.user!;
    const updatedProfile: UpdateProfilePayload = req.body;

    await UserDao.updateProfile(uuid, {
      email: updatedProfile.email || email,
      firstName: updatedProfile.firstName || firstName,
      lastName: updatedProfile.lastName || lastName,
      isAdmin: updatedProfile.isAdmin,
    });

    res.status(204).end();
  } catch (err) {
    next(new HttpInternalError(err as string));
  }
});

export default router;
