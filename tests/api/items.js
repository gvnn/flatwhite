var request = require("./request");
var querystring = require("querystring");
var unitTest;

var contentItem = {
    "title": "title test",
    "summary": "summary test",
    "text": "text test",
    "code": "code" + Math.random(),
    "active": true
};

exports.testItemsApi = function(test) {
    unitTest = test;
    startTest(test);
};

var startTest = function(test) {
    unitTest = test;
    //add new item
    addItem(test, function(responseObj) {
        //get item
        getItem(responseObj._id, unitTest, function(responseObj) {
            //test on tags
            tagsTest(responseObj, unitTest, function() {
                //update item
                updateItem(responseObj._id, unitTest, function(itemId) {
                    //remove item
                    deleteItem(itemId, unitTest, function(itemId) {
                        //check exists or not
                        getItem(itemId, unitTest, function(responseObj) {
                            unitTest.equal(responseObj, null);
                            unitTest.done();
                        }, false);
                    });
                });
            });
        });
    });
};

var updateItem = function(id, test, callback) {
    unitTest = test;
    objId = id;
    var postData = querystring.stringify({
        "title" : contentItem.title + Math.random(),
        "summary": contentItem.summary + Math.random(),
        "text": contentItem.text + Math.random(),
        "active": !contentItem.active
    });
    request.post('PUT', 'items/' + objId, postData, function(res, chunk) {
        unitTest.equal(res.statusCode, 200);
        var response = JSON.parse(chunk);
        callback(objId);
    });
};

var tagsTest = function(o, test, callback) {
    obj = o;
    unitTest = test;
    //add tag
    addTag(obj._id, unitTest, function() {
        //get list by tag
        getByTag('tag1', unitTest, function(items) {
            //check item in there
            notfound = true;
            for (var i=0; i < items.length; i++) {
                notfound = !(items[i]._id == obj._id);
                if(!notfound)
                    break;
            };
            unitTest.ok(notfound);
            callback();
        });
    });
};

var addTag = function(id, test, callback) {
    unitTest = test;
    objId = id;
    var postData = querystring.stringify({"tag" : "tag1, tag2" });
    request.post('POST', 'items/' + objId + '/tags', postData, function(res, chunk) {
        unitTest.equal(res.statusCode, 200);
        var response = JSON.parse(chunk);
        //remove tag
        deleteTag(objId, unitTest, callback);
    });
};

var deleteTag = function(id, test, callback) {
    unitTest = test;
    objId = id;
    var postData = querystring.stringify({"tag" : "tag1" });
    request.post('DELETE', 'items/' + objId + '/tags', postData, function(res, chunk) {
        unitTest.equal(res.statusCode, 200);
        var response = JSON.parse(chunk);
        callback();
    });
};

var getByTag = function(tag, test, callback) {
    unitTest = test;
    request.get('tags/tag1?fields=title,summary&page=1&size=2&orderby=_id&orderdirection=desc', function(res, chunk) {
        unitTest.equal(res.statusCode, 200);
        var response = JSON.parse(chunk);
        callback(response);
    });
};

var deleteItem = function(id, test, callback) {
    objId = id;
    request.post('DELETE', 'items/' + id, '', function(res, chunk) {
        unitTest.equal(res.statusCode, 200);
        callback(objId);
    });
};

var addItem = function(test, callback) {
    unitTest = test;
    var postData = querystring.stringify(contentItem);
    request.post('POST', 'items/', postData, function(res, chunk) {
        unitTest.equal(res.statusCode, 200);
        var response = JSON.parse(chunk);
        callback(response);
    });
};

var getItem = function(id, test, callback, check) {
    unitTest = test;
    objId = id;
    flagCheck = check == null ? true : check;
    request.get('items/' + objId, function(res, chunk) {

        var response = JSON.parse(chunk);
        
        if(flagCheck) {
            unitTest.equal(res.statusCode, 200);
            unitTest.equal(response.title, contentItem.title);
            unitTest.equal(response.summary, contentItem.summary);
            unitTest.equal(response.text, contentItem.text);
            unitTest.equal(response.code, contentItem.code);
            unitTest.equal(response.active, contentItem.active);
        } else {
            unitTest.equal(res.statusCode, 404);
            response = null;
        }
        
        callback(response);
    });

};