var wru = require('./wru.js');
var querystring = require('querystring');

wru.test([
  {
    name: 'querystring.stringify',
    test: function() {
      var stringified = querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: ''});
      wru.assert(true, stringified == 'foo=bar&baz=qux&baz=quux&corge=');

      var stringified2 = querystring.stringify({foo: 'bar', baz: 'qux'} , ';', ':');
      wru.assert(true, stringified2 == 'foo:bar;baz:qux');
    }
  },
  {
    name: 'querystring.parse',
    test: function() {
      var parsed = querystring.parse('foo=bar&baz=qux&baz=quux&corge')

      wru.assert(true, parsed.constructor === Object)
      wru.assert(true, parsed.foo == "bar");
      wru.assert(true, parsed.baz.constructor === Array);
      wru.assert(true, parsed.baz[0] == "qux");
      wru.assert(true, parsed.baz[1] == "quux");
      wru.assert(true, parsed.corge == "");
    }
  },
  {
    name: 'querystring.parse with different delimiters',
    test: function() {
      var parsed = querystring.parse('foo:bar;baz:qux', ";", ":");

      wru.assert(true, parsed.constructor === Object);
      wru.assert(true, parsed.foo == "bar");
      wru.assert(true, parsed.baz == "qux");
    }
  }
])
