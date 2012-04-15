importPackage(com.mowforth.rhinode);

function Module() {
  this.require = function (name) {
    var exports = {};
    ModuleLoader.require(name,
                       Rhinode.getEngine(), exports);
    return exports;
  }
}

var require = new Module().require;


