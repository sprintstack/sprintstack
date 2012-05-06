var wru = require('./wru');

wru.test({
    name: "Hello wru!",
    test: function () {
        wru.assert("it works!", 1);}});
