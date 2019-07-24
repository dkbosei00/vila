import { asyncDocumentReady } from './utils';
import io from 'socket.io-client';

let socket;

function connected(event) {
  window.socket = socket
  console.log('Connected');
  console.log(socket.emit( 'message', { data: 'User Connected' } ));
}

function getMessage(event) {
  console.log(event)
}

function init() {
  socket = io(`http://${document.domain}:${location.port}`)
  socket.on('connect', connected);
  socket.on('event', function(data){console.log(data)});
  socket.on('message', getMessage);
};

asyncDocumentReady(init)

