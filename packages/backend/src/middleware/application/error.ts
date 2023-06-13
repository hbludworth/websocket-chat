import { Request, Response, NextFunction } from 'express';
import HttpException from '@/exceptions/HttpException';

const errorMiddleware = async (
  error: HttpException,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = error.status || 500;
  const message =
    typeof error.message === 'string' ? error.message : String(error);

  if (!error.preventLog) {
    console.log(message); // eslint-disable-line no-console
  }

  res.status(status).json({
    status,
    message: `${status} Error: ${message}`,
  });
};

export default errorMiddleware;
