import express from 'express';
import authenticatedRoute from '@/middleware/router/authenticatedRoute';
import { HttpInternalError } from '@/exceptions';
import adminRoute from '@/middleware/router/adminRoute';

const router = express.Router();

router.route('/tests/open').get(async (req, res, next) => {
  try {
    res.status(200).end();
  } catch (err) {
    next(new HttpInternalError(err as string));
  }
});

router.route('/tests/auth').get(authenticatedRoute, async (_req, res, next) => {
  try {
    res.status(200).end();
  } catch (err) {
    next(new HttpInternalError(err as string));
  }
});

router.route('/tests/admin').get(adminRoute, async (_req, res, next) => {
  try {
    res.status(200).end();
  } catch (err) {
    next(new HttpInternalError(err as string));
  }
});

export default router;
