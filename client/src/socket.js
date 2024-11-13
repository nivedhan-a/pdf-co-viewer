import { io } from 'socket.io-client';

const socket = io('https://pdf-co-viewer-backend.vercel.app');
export default socket;
