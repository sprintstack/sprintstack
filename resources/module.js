importPackage(com.mowforth.rhinode);

function Module() {
  this.exports = {};

  this.require = function (id) {
    return ModuleLoader.require(id, new Module());
  }

  this.resolve = function(id) {
    return ModuleLoader.resolveString(id);
  }
}

var module = new Module();
var require = module.require;

