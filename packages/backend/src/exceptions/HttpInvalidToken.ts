import HttpException from './HttpException';

class HttpInvalidToken extends HttpException {
  constructor() {
    super(407, 'Invalid Authentication Token', true);
  }
}

export default HttpInvalidToken;
