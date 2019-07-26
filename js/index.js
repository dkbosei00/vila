import { asyncDocumentReady } from './utils';
import io from 'socket.io-client';

let socket;
let chatbox;
let username;
let channel;

const onlineClients = [];

function createList(onlineClients) {
  listObject = document.querySelector('.sidebar')
  listItems = onlineClients.map(client => `<div>${client.name}</div>`)
  listObject.innerHTML(listItems.join(''))
}

// This should be run after the socket becomes connected
function pollOnline() {
  // This sends a message to everyone online that you are online too
  socket.emit('message', {type: 'poll', name: username, channel: channel});
  onlineClients = onlineClients.filter(client => client.timestamp >= Date.now() - 20000 )
  createList(onlineClients)
  setTimeout(pollOnline, 5000)
}

function handleIncomingPoll(event) {
  let clientFound = false;
  // scan through existing users if users is already "online"
  onlineClients.map((client) => {
    if (client.username == event.name) {
      clientFound = true;
      client.timestamp = Date.now()
    }
  })
  // Add the user to the list if the user didn't exist in the list yet
  if (!clientFound) onlineClients.push({name: event.name, timestamp: Date.now()})
} 

// You already have this
function messageHandler(event) {
  // This is where you normally receive messages
  if (event.channel !== channel) return;
  if (event.type === 'poll') {
    handleIncomingPoll(event);
  }
  // the rest of your already existing message printing logic
}



function connected(event) {
  window.socket = socket
  socket.emit( 'message', { type: 'connected', name: username, message: 'connected', channel: channel } );
}


function getMessage(event) {
  if (event.channel !== channel) return;

  const message = document.createElement('div');
  message.classList.add('message');
  const userName = (event.type === 'chat' ? `<span class="user-name">${event.name}:</span> ` : `${event.name} `)
  message.innerHTML = `${userName}${event.message}`;
  chatbox.appendChild(message);
}

function processForm(event) {
  event.preventDefault();
  const input = event.target.querySelector('.typing')

  if (!username || !channel || input.value === '') return;

  // Send the message
  socket.emit( 'message', { type: 'chat', name: username, message: input.value, channel: channel } );
  
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
  channel = document.body.dataset.channel;
  username = document.body.dataset.username;

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

