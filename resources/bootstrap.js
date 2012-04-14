importPackage(com.mowforth.rhinode);

var require = function (name) {
  var exports = {};
  ModuleLoader.require(name,
                       Rhinode.getEngine(), exports);
  return exports;
}

require.resolve = function(name) {
  return "";
}

