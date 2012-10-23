var TTY = function() {

  this.isatty = function(fd) {
    return false;
  }

}

module.exports = new TTY();

