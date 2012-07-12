var wru = require('./wru.js');

wru.test({
    name: "Hello wru!",
    test: function () {
        wru.assert("it works!", 1);}});
