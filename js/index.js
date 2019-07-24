import { asyncDocumentReady } from './utils';
import io from 'socket.io-client';

let socket;

function connected(event) {
  socket.emit( 'Connection', { data: 'User Connected' } );
}

function getMessage(event) {
  console.log(event)
}

function init() {
  socket = io(`http://${document.domain}:${location.port}`)
  socket.on('connect', connected);
  socket.on('message', getMessage);
};

asyncDocumentReady(init)

