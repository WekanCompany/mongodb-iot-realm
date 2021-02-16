'use strict';

function Broker(aedes) {
  this._server = require('net').createServer(aedes.handle);
}

Broker.prototype.getServer = function getServer() {
  return this._server;
};

Broker.prototype.start = function start(port) {
  this._server.listen(port, function () {
    console.log('Aedes broker started and listening on port ', port);
  });
};

Broker.prototype.closed = function pasue() {
  console.log('Restarting Aedes broker ...');
  this._server.close();
};

module.exports = Broker;
