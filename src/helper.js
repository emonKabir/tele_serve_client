import { io } from 'socket.io-client';

export function getClient() {
  const socket = io('ws://18.143.64.128:14276', {
    path: '/ws/telegram/',
    transports: ['websocket', 'polling'],
    perMessageDeflate: false,
    timeout: 20000,
    requestTimeout: 20000,
  });

  socket.on('connection', (socket) => {
    console.log('connected ', socket.id); // x8WIv7-mJelg7on_ALbx
  });
  return socket;
}
//   const socket = io(process.env.REACT_APP_API_URL, {
//     transports: ['websocket', 'polling'],
//     perMessageDeflate: false,
//     timeout: 20000,
//     requestTimeout: 20000,
//   });
