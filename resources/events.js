var EventEmitter = function() {

  this.on = function(event, listener) {
  };

  this.addListener = this.on;

  this.emit = function() {
  };

  this.stop = function() {
  };

};

exports.EventEmitter = EventEmitter;

