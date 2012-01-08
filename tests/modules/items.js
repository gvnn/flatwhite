var items = require("../../src/modules/items");
var config = require("../../src/config");
var unitTest;

var contentItem = {
    "title": "title test",
    "summary": "summary test",
    "text": "text test",
    "code": "uniquecode",
    "active": true
};

exports.testItems = function(test) {
    unitTest = test;
    addItem();
};

var addItem = function() {
    //add new Item
    items.addItem(contentItem, function(err, item) {
        unitTest.notEqual(item._id, null);
        //get item and check if it's equal to the original object
        getItem(item._id.toString(), function(obj) {
            unitTest.notEqual(obj._id, null);
            unitTest.equal(contentItem.title, obj.title);
            unitTest.equal(contentItem.summary, obj.summary);
            unitTest.equal(contentItem.text, obj.text);
            unitTest.equal(contentItem.active, obj.active);
            //get by code
            getItemByCode(item.code, function(obj) {
                unitTest.equal(obj.length, 1);
                //delete
                deleteItem(obj[0]._id.toString());
            });
        });
    });
}

var deleteItem = function(itemId) {
    items.deleteItem(itemId, function(err, obj) {
        getItem(itemId, function(obj){
            unitTest.equal(null, obj);
            unitTest.done();
        });
    });
};

var getItem = function(itemId, callback) {
    items.getItem(itemId, function(err, obj) {
        callback(obj);
    });
};

var getItemByCode = function(code, callback) {
    items.getItemByCode(code, function(err, obj) {
        callback(obj);
    });
};