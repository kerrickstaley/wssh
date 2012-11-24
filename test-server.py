#!/usr/bin/env python2
import threading
import time
# HTTP-related
import SimpleHTTPServer
import SocketServer
import os
# websocket-related
from gevent import monkey; monkey.patch_all()
from ws4py.server.geventserver import WebSocketServer
from ws4py.websocket import WebSocket

class HTTPThread(threading.Thread):
    daemon = True
    def run(self):
        os.chdir('data')
        server = SocketServer.TCPServer(('', 8000), SimpleHTTPServer.SimpleHTTPRequestHandler)
        server.allow_reuse_address = True
        server.serve_forever()

class PrintWebSocket(WebSocket):
    def received_message(self, message):
        print message

class WebsocketThread(threading.Thread):
    daemon = True
    def run(self):
        server = WebSocketServer(('127.0.0.1', 8001), websocket_class=PrintWebSocket)
        server.serve_forever()

HTTPThread().start()
WebsocketThread().start()

while True:
    time.sleep(1)
    
