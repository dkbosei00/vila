#!/usr/bin/python3

from flask_socketio import SocketIO
from flask import Flask, render_template

app = Flask(__name__)
app.config["SECRET KEY"] = 'vnkdjnfjknfl1232#'
Socketio = SocketIO(app)



@app.route('/')
def index():
    return render_template("index.html")

def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')

@socketio.on('my event')
def handle_my_custom_event(json, methods=['GET', 'POST']):
    print('received my event: ' + str(json))
    socketio.emit('my response', json, callback=messageReceived)

#if __name__ == '__main__':
#    app.run(debug = True, host = '0.0.0.0')

if __name__ == '__main__':
    Socketio.run(app, debug = True)
