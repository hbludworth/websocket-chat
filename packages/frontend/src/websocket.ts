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

    console.log('Connecting...');
    socket = new WebSocket(`${socketProtocol}://${socketHost}/${token}`);

    socket.onopen = () => {
      console.log('Connected!');
      numAttempts = 0;
      clearInterval(interval);
      store.setSocket(socket);

      socket.onclose = () => {
        console.log('Connection lost');
        interval = setInterval(resetSocket, 1000);
      };
    };
  };

  resetSocket();
  let interval = setInterval(resetSocket, 1000);
};

export default createWebsocket;
