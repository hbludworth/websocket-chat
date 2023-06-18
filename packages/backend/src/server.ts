import '../envConfig';
import app from '@/app';
import { initializeFirebase } from '@/firebase';
import { type User } from 'types';
import sl from '@/serviceLocator';
import WebSocketStarter from '@/websocket';

import UserDao from '@/daos/UserDao';
import ThreadDao from '@/daos/ThreadDao';
import MessageDao from '@/daos/MessageDao';

declare global {
  namespace Express {
    interface Request {
      user: User | null;
    }
  }
}

initializeFirebase((err) => {
  if (err) {
    console.error(err); // eslint-disable-line no-console
  } else {
    const httpServer = app.listen(8082, () => {
      console.log('Listening on port 8082'); // eslint-disable-line no-console
    });

    const WebSocket = new WebSocketStarter(httpServer);

    sl.set('UserDao', UserDao);
    sl.set('ThreadDao', ThreadDao);
    sl.set('MessageDao', MessageDao);
    sl.set('WebSocket', WebSocket);
  }
});
