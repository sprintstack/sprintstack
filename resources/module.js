importPackage(com.mowforth.rhinode);

function Module() {
  this.exports = {};

  this.require = function (id) {
    return ModuleLoader.require(id, this.exports);
  }

  this.resolve = function(id) {
    return ModuleLoader.resolveString(id);
  }
}

var require = new Module().require;


