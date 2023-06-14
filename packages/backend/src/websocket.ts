import { Server } from 'http';
import { User } from 'types';
import { WebSocketServer, WebSocket } from 'ws';
import firebase from '@/firebase';
import sl from '@/serviceLocator';

interface WebSocketConnection {
  userUuid: string;
  ws: WebSocket;
  alive: boolean;
}

export default class WebSocketStarter {
  constructor(server: Server) {
    // Create WebSocket server
    const wss = new WebSocketServer({ noServer: true });

    // Handle upgrade event
    server.on('upgrade', (req, socket, head) => {
      wss.handleUpgrade(req, socket, head, async (ws) => {
        wss.emit('connection', ws, req);
      });
    });

    // Keep track of connections
    const connections: WebSocketConnection[] = [];

    // Handle connection event
    wss.on('connection', async (ws, req) => {
      // Authenticate user
      let user: User | null;
      try {
        const UserDao = sl.get('UserDao');
        const idToken = req.headers.authorization;

        if (!idToken) {
          throw new Error(
            'Connection request does not contain an authorization header'
          );
        }

        const decodedToken = await firebase.auth().verifyIdToken(idToken);

        user = await UserDao.getUserByUuid(decodedToken.uid);
        if (!user) {
          throw new Error("User doesn't exist");
        }
      } catch (err) {
        // Close connection if user is not authenticated
        console.log(`Error: ${err}`);
        ws.terminate();
        return;
      }

      // Add connection to list
      const connection: WebSocketConnection = {
        userUuid: user.uuid,
        ws,
        alive: true,
      };
      connections.push(connection);

      // Handle close
      ws.on('close', () => {
        connections.forEach((c, idx) => {
          if (c.userUuid === connection.userUuid) {
            connections.splice(idx, 1);
          }
        });
      });

      // Response to pong messages by keeping connection alive
      ws.on('pong', () => {
        connection.alive = true;
      });

      // Handle messages
      ws.on('message', (data) => {
        console.log('Received message:');
        console.log(data.toString());
      });
    });

    // Keep connections alive
    setInterval(() => {
      connections.forEach((c) => {
        // Kill connections that haven't responded to ping
        if (!c.alive) {
          c.ws.terminate();
        } else {
          c.alive = false;
          c.ws.ping();
        }
      });
    }, 10000);
  }
}
