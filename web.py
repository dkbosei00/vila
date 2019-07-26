#!/usr/bin/python3

from flask_socketio import SocketIO
from flask import Flask, render_template, request

app = Flask(__name__)
app.config["SECRET KEY"] = 'vnkdjnfjknfl1232#'
socketio = SocketIO(app)

@app.route('/')
def inddex():
    return render_template('test.html')

@app.route('/chat')
def chat():
    username = request.args.get('username')
    channel = request.args.get('channel')
    return render_template("chat.html", username=username, channel=channel)

def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')

@socketio.on('message')
def handle_my_custom_event(json, methods=['GET', 'POST']):
    print('received my event: ' + str(json))
    socketio.emit('message', json, callback=messageReceived)

#if __name__ == '__main__':
#    app.run(debug = True, host = '0.0.0.0')

if __name__ == '__main__':
    socketio.run(app, debug = True, host = '0.0.0.0')
