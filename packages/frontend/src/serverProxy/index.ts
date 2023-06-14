import login from './routes/login';
import logout from './routes/logout';
import profile from './routes/profile';
import register from './routes/register';
import reset_password from './routes/reset_password';
import users from './routes/users';
import threads from './routes/threads';
import messages from './routes/messages';

const serverProxy = {
  ...login,
  ...logout,
  ...profile,
  ...register,
  ...reset_password,
  ...users,
  ...threads,
  ...messages,
};

export default serverProxy;
