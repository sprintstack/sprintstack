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
      if (mod instanceof java.lang.String) {
        return JSON.parse(mod);
      } else {
        var union = Object.extend(mod.intermediate, mod.exports);
        mod.exports = union;
        mod.intermediate = null;
        return mod.exports;
      }
    }
    return null;
  }

  this.resolve = function(id) {
    return ModuleLoader.resolveString(id);
  }
}

var alert = function(msg) { javax.swing.JOptionPane.showMessageDialog(null, msg); };

var require = new Module().require;

