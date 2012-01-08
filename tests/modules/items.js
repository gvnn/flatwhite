var items = require("../../src/modules/items");
var tags = require("../../src/modules/items/tags");
var config = require("../../src/config");
var unitTest;

var contentItem = {
    "title": "title test",
    "summary": "summary test",
    "text": "text test",
    "code": "",
    "active": true,
    "images": [],
    "tags": []
};

var itemTags = ['test', 'tag'];

exports.testItems = function(test) {
    unitTest = test;
    config.logs.enabled = false;
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
                if(contentItem.code) {
                    unitTest.equal(obj.length, 1);
                }
                //delete
                deleteItem(obj[0]._id);
            });
        });
    });
}

var deleteItem = function(itemId) {
    var id = itemId;
    items.deleteItem(id.toString(), function(err, obj) {
        getItem(id.toString(), function(obj){
            unitTest.equal(null, obj);
            unitTest.done();
        });
    });
};

var getItem = function(itemId, callback) {
    items.getItem(itemId, function(err, obj) {
        unitTest.equal(null, err);
        callback(obj);
    });
};

var getItemByCode = function(code, callback) {
    items.getItemByCode(code, function(err, obj) {
        unitTest.equal(null, err);
        callback(obj);
    });
};

var addTag = function(itemId, itemTags, callback) {
    var id = itemId;
    tags.addTag(id.toString(), itemTags, function(err, obj) {
        unitTest.equal(null, err);
        callback(id);
    });
}