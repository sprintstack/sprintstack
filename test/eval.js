var console = require('console')

var x = function() {
  eval("var y = 1;");
}

x();

console.log(x);
console.log(x.y);

java.lang.Thread.sleep(100)
