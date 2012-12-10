var wru = require('./wru.js');
var punycode = require('punycode');

wru.test([
  {
    name: 'puny.decode',
    test: function() {
      wru.assert(true, punycode.decode('maana-pta') == 'mañana')
    }
  },
  {
    name: 'puny.decode2',
    test: function() {
      wru.assert(true, punycode.decode('--dqo34k') == '☃-⌘')
    }
  },
  {
    name: 'puny.encode',
    test: function() {
      wru.assert(true, punycode.encode('mañana') == 'maana-pta')
    }
  },
  {
    name: 'puny.encode2',
    test: function() {
      wru.assert(true, punycode.encode('☃-⌘') == '--dqo34k')
    }
  },
  {
    name: 'puny.toUnicode',
    test: function() {
      wru.assert(true, punycode.toUnicode('xn--maana-pta.com') == 'mañana.com')
    }
  },
  {
    name: 'puny.toASCII',
    test: function() {
      wru.assert(true, punycode.toASCII('mañana.com') == 'xn--maana-pta.com')
    }
  },
  {
    name: 'puny.ucs2.decode',
    test: function() {
      wru.assert(true, punycode.ucs2.decode('\uD834\uDF06').equals([0x1D306]))
    }
  },
  {
    name: 'puny.ucs2.encode',
    test: function() {
      wru.assert(true, punycode.ucs2.encode([0x1D306]) === '\uD834\uDF06')
    }
  }
]);

