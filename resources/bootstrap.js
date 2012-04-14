var require = function (name) {
  var exports = {};
  com.mowforth.rhinode.ModuleLoader.require(name, com.mowforth.rhinode.Rhinode.getEngine());
  return exports;
}

require.resolve = function(name) {
  return "";
}

