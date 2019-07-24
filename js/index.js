import { asyncDocumentReady } from './utils';
import io from 'socket.io-client';

let socket;
let chatbox;

function connected(event) {
  window.socket = socket
  socket.emit( 'message', { type: 'connected', name: 'Foo', message: 'New user connected' } );
}

function getMessage(event) {
  console.log(event);
  const message = document.createElement('div');
  message.classList.add('message');
  const userName = (event.type === 'chat' ? `<span class="user-name">${event.name}:</span> ` : '')
  message.innerHTML = `${userName}${event.message}`;
  chatbox.appendChild(message);
}

function processForm(event) {
  event.preventDefault();
  const name = event.target.querySelector('.user-name')
  const input = event.target.querySelector('.typing')

  if (name.value === '' || input.value === '') return;

  // Send the message
  socket.emit( 'message', { type: 'chat', name: name.value, message: input.value } );
  
  // Clear the form
  input.value = '';

  // Form events must return false as the last step
  return false;
}

function setupPostForm() {
  const form = document.querySelector('form.message-form')
  if (form.attachEvent) {
    form.attachEvent("submit", processForm);
  } else {
      form.addEventListener("submit", processForm);
  }
}

function init() {
  // Make a connection
  socket = io(`http://${document.domain}:${location.port}`)
  socket.on('connect', connected);
  socket.on('event', function(data){console.log(data)});
  socket.on('message', getMessage);

  // Assign some things
  chatbox = document.querySelector('.chatview');

  // form submition
  setupPostForm();
};

asyncDocumentReady(init)

