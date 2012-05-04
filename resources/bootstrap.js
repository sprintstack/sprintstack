global = this;

this.console = require('console');
this.process = require('process');

var timers = require('timers');

this.setTimeout = timers.setTimeout;
this.setInterval = timers.setInterval;
this.clearInterval = timers.clearInterval;
this.clearTimeout = timers.clearTimeout;

this.alert = function(msg) { javax.swing.JOptionPane.showMessageDialog(null, msg); };

