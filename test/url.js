var wru = require('./wru.js');
var url = require('url');

wru.test([
  {
    name: 'url.parse',
    test: function() {
      var parsed = url.parse("http://user:pass@host.com:8080/p/a/t/h?query=string#hash");
      wru.assert(true, parsed.href == 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash');
      wru.assert(true, parsed.protocol == 'http:');
      wru.assert(true, parsed.host == 'host.com:8080');
      wru.assert(true, parsed.auth == 'user:pass');
      wru.assert(true, parsed.hostname == 'host.com');
      wru.assert(true, parsed.port == '8080');
      wru.assert(true, parsed.pathname == '/p/a/t/h');
      wru.assert(true, parsed.search == '?query=string');
      wru.assert(true, parsed.query == 'query=string');
      wru.assert(true, parsed.hash == '#hash');
    }
  },
  {
    name: 'url.resolve',
    test: function() {
      // Taken from nodemanual.org
      var relativeUrls = [
        ['/foo/bar/baz', 'quux', '/foo/bar/quux'],
        ['/foo/bar/baz', 'quux/asdf', '/foo/bar/quux/asdf'],
        ['/foo/bar/baz', '../../../../../../../../quux/baz', '/quux/baz'],
        ['/foo/bar/baz', '../../../../../../../quux/baz', '/quux/baz'],
        ['http://example.com/b//c//d;p?q#blarg',
         'http:#hash2',
         'http://example.com/b//c//d;p?q#hash2'],
        ['http://example.com/b//c//d;p?q#blarg',
         'http:/a/b/c/d',
         'http://example.com/a/b/c/d'],
        ['/foo/bar/baz', '/../etc/passwd', '/etc/passwd']];

      relativeUrls.forEach(function(relativeUrl) {
        var sResolvedUrl = url.resolve(relativeUrl[0], relativeUrl[1]);
        wru.assert(true, sResolvedUrl == relativeUrl[2]);
      });
    }
  }
]);
