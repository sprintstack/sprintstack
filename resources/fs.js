importClass(com.sprintstack.core.IFS);

var Fs = function() {

  this.writeFileSync = function() {
    var filename = arguments[0];
    var data = arguments[1];
    IFS.writeFile(filename, data);
  }

}

module.exports = new Fs();
