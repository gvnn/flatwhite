var request = require("./request");
var querystring = require("querystring");
var upload = require("./upload");
var config = require("../../src/config");
var unitTest;

var options = {
    host : config.server.ip,
    port : config.server.port,
    path : '/1/files',
    method : 'POST',
    encoding : 'utf8'
};

exports.testFilesModule = function(test) {
    unitTest = test;
    startTest(test);
};

var startTest = function(test) {
    unitTest = test;
    //upload file
    upload.postImage(options, "images/coffee.png", {}, function(response) {
        //delete file
        var newFile = JSON.parse(response.body);
        deleteFile(newFile._id, unitTest, function() {
            getFiles(unitTest, function(items) {
                //check item in there
                notfound = true;
                for (var i=0; i < items.length; i++) {
                    notfound = !(items[i]._id == newFile._id);
                    if(!notfound)
                        break;
                };
                unitTest.ok(notfound);
                unitTest.done(); 
            });
        });
    });
};

var deleteFile = function(id, test, callback) {
    unitTest = test;
    objId = id;
    var postData = querystring.stringify({"url" : "http://domain.com/test.txt", "type": "image" });
    request.post('DELETE', 'files/' + objId, postData, function(res, chunk) {
        unitTest.equal(res.statusCode, 200);
        var response = JSON.parse(chunk);
        callback();
    });
};

var getFiles = function(test, callback) {
    unitTest = test;
    request.get('files/?fields=filename,type&page=1&size=2&orderby=_id&orderdirection=desc', function(res, chunk) {
        unitTest.equal(res.statusCode, 200);
        var response = JSON.parse(chunk);
        callback(response);
    });
};