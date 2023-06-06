import express from 'express';

const router = express.Router();

router.route('/hello_world').get(async (req, res, next) => {
  res.json({
    status: 'Success',
    message: 'Hello World!',
  });
});

export default router;
