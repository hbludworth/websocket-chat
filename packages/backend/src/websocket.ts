import { IncomingMessage, Server } from 'http';
import { User, WebSocketPayload } from 'types';
import { WebSocketServer, WebSocket } from 'ws';
import firebase from '@/firebase';
import sl from '@/serviceLocator';
import { v4 } from 'uuid';

interface WebSocketConnection {
  uuid: string;
  userUuid: string;
  ws: WebSocket;
  alive: boolean;
}

export default class WebSocketStarter {
  // Keep track of connections
  private connections: WebSocketConnection[] = [];

  // Authenciates connection
  private handleAuthentication = async (
    req: IncomingMessage
  ): Promise<User | null> => {
    try {
      const UserDao = sl.get('UserDao');

      const idToken = req.url?.substring(1);
      if (!idToken) {
        throw new Error(
          'Connection request does not contain an authorization header'
        );
      }

      const decodedToken = await firebase.auth().verifyIdToken(idToken);

      const user = await UserDao.getUserByUuid(decodedToken.uid);

      return user;
    } catch (err) {
      console.log(`Error: ${err}`);
      return null;
    }
  };

  // Handles closing of connection
  private handleClose(connection: WebSocketConnection): void {
    this.connections.forEach((c, idx) => {
      if (c.uuid === connection.uuid) {
        this.connections.splice(idx, 1);
      }
    });
  }

  // Handles sending messages to a user's open connections
  public sendToUser(userUuid: string, payload: WebSocketPayload): void {
    this.connections.forEach((c) => {
      if (c.userUuid === userUuid) {
        c.ws.send(JSON.stringify(payload));
      }
    });
  }

  constructor(server: Server) {
    // Create WebSocket server
    const wss = new WebSocketServer({ noServer: true });

    // Handle upgrade event
    server.on('upgrade', (req, socket, head) => {
      wss.handleUpgrade(req, socket, head, async (ws) => {
        wss.emit('connection', ws, req);
      });
    });

    // Handle connection event
    wss.on('connection', async (ws, req) => {
      // Authenticates connection. If authentication fails, connection is terminated.
      const user = await this.handleAuthentication(req);
      if (!user) {
        ws.terminate();
        return;
      }

      // Add connection to list
      const connection: WebSocketConnection = {
        uuid: v4(),
        userUuid: user.uuid,
        ws,
        alive: true,
      };
      this.connections.push(connection);

      // Handle close
      ws.on('close', () => {
        this.handleClose(connection);
      });

      // Response to pong messages by keeping connection alive
      ws.on('pong', () => {
        connection.alive = true;
      });

      // Handle messages
      ws.on('message', async (data) => {
        const message = JSON.parse(data.toString());
        console.log(message);
      });
    });

    // Keep connections alive
    setInterval(() => {
      this.connections.forEach((c) => {
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
