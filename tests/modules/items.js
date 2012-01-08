var items = require("../../src/modules/items");
var config = require("../../src/config");

exports.testItems = function(test) {
    test.expect(1);
    test.ok(1, items.version);
    test.done();
};