importClass(com.mowforth.rhinode.ModuleLoader);

Object.extend = function(a,b) {
  for (var key in b) { a[key] = b[key]; };
  return a;
}

function Module() {
  this.exports = {}

  this.require = function (id) {
    var mod = ModuleLoader.require(id, new Module());
    if (mod != null) {
      var union = Object.extend(mod.intermediate, mod.exports);
      mod.exports = union;
      mod.intermediate = null;
      return mod.exports;
    }
    return null;
  }

  this.resolve = function(id) {
    return ModuleLoader.resolveString(id);
  }
}

var require = new Module().require;

