import { asyncDocumentReady } from './utils';
import io from 'socket.io-client';

let socket;
let chatbox;

function connected(event) {
  window.socket = socket
  socket.emit( 'message', { type: 'connected', name: document.body.dataset.username, message: 'connected' } );
}


function getMessage(event) {
  console.log(event);
  const message = document.createElement('div');
  message.classList.add('message');
  const userName = (event.type === 'chat' ? `<span class="user-name">${event.name}:</span> ` : `${event.name} `)
  message.innerHTML = `${userName}${event.message}`;
  chatbox.appendChild(message);
}

function processForm(event) {
  event.preventDefault();
  const name = document.body.dataset.username
  console.log(name)
  const input = event.target.querySelector('.typing')

  if (!name || input.value === '') return;

  // Send the message
  socket.emit( 'message', { type: 'chat', name: name, message: input.value } );
  
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

