var items = require("../../src/modules/items");
var tags = require("../../src/modules/items/itemTags");
var config = require("../../src/config");
var unitTest;

var contentItem = {
    "title": "title test",
    "summary": "summary test",
    "text": "text test",
    "code": "code" + Math.random(),
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
        // get item and check if it's equal to the original object
        getItem(item._id.toString(), function(obj) {
            unitTest.notEqual(obj._id, null);
            unitTest.equal(contentItem.title, obj.title);
            unitTest.equal(contentItem.summary, obj.summary);
            unitTest.equal(contentItem.text, obj.text);
            unitTest.equal(contentItem.active, obj.active);
            //assign id
            contentItem._id = obj._id;
            //get by code
            getItemByCode(item.code, function(obj) {
                if(contentItem.code) {
                    unitTest.equal(obj.length, 1);
                }
                //add tag
                addTag(obj[0]._id, ['tag1', 'tag2'], function(obj) {
                    //delete
                    deleteItem(contentItem._id);
                });
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
    tags.addTag(id.toString(), itemTags, function(err, added) {
        unitTest.equal(null, err);
        unitTest.equal(added, 1);
        callback(id);
    });
};

var deleteTag = function(itemId, itemTags, callback) {
    var id = itemId;
    tags.deleteTag(id.toString(), itemTags, function(err, deleted) {
        unitTest.equal(null, err);
        unitTest.equal(deleted, 1);
        callback(id);
    });
};