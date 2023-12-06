import { io, Socket } from 'socket.io-client';

const socket: Socket = io('https://chefcito-back-production.up.railway.app/');
export default socket
