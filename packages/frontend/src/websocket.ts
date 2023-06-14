import store from '@/store';

const createWebsocket = () => {
  const socketProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const socketHost =
    process.env.NODE_ENV === 'development' ? 'localhost:8081' : '';
  const token = store.getters.idToken;

  let socket: WebSocket;

  const resetSocket = () => {
    if (socket && socket.readyState === socket.OPEN) {
      return;
    }

    console.log('Reconnecting...');
    socket = new WebSocket(`${socketProtocol}://${socketHost}/${token}`);

    socket.onclose = () => {
      console.log('Connection closed');
      setInterval(resetSocket, 1000);
    };

    socket.onopen = () => {
      console.log('Connection opened');
      clearInterval(interval);
      store.setSocket(socket);
    };
  };

  const interval = setInterval(resetSocket, 1000);
};

export default createWebsocket;
