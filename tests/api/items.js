var request = require("./request");
var querystring = require("querystring");
var unitTest;

var addContentItem = function() {
    
    var postData = querystring.stringify({
        "title": "title test",
        "summary": "summary test",
        "text": "text test",
        "code": "uniquecode",
        "active": true
    });
    
    request.post('POST', 'items', postData, function(res, chunk) {
        unitTest.equal(res.statusCode, 200);
        response = JSON.parse(chunk);
        unitTest.notEqual(response._id, null);
        unitTest.done();
    });
};

exports.testItemsApi = function(test) {
    unitTest = test;  
    addContentItem();
};