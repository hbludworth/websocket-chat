import store from '@/store';

const createWebsocket = () => {
  const socketProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const socketHost =
    process.env.NODE_ENV === 'development' ? 'localhost:8081' : '';
  const token = store.getters.idToken;

  let socket: WebSocket;

  let numAttempts = 0;

  const resetSocket = () => {
    numAttempts += 1;
    if (socket && socket.readyState === socket.OPEN) {
      return;
    }

    if (numAttempts > 5) {
      clearInterval(interval);
      return;
    }

    socket = new WebSocket(`${socketProtocol}://${socketHost}/${token}`);

    socket.onopen = () => {
      numAttempts = 0;
      clearInterval(interval);
      store.setSocket(socket);

      socket.onclose = () => {
        interval = setInterval(resetSocket, 1000);
      };
    };
  };

  let interval = setInterval(resetSocket, 1000);
};

export default createWebsocket;
