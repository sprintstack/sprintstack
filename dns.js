var dns = require('dns');

dns.resolve("google.com", "A", function(e,a) {
  java.lang.System.out.println(a.length);
});

