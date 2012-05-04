var Process = function() {

  this.exit = function() {
    var code = 0;
    if (arguments.length > 0) code = arguments[0];
    java.lang.System.exit(code);
  };

};

module.exports = new Process();

