var request = require("./request");
var querystring = require("querystring");
var unitTest, client;
var adminNumber = 0;

var startTest = function(test) {
    unitTest = test;
    //get list
    getList(function(num) {
        adminNumber = num;
        
        //first test: add admin
        var postData = querystring.stringify({
            "email" : "admin@domain.com",
            "password": "password",
            "active": true
        });
        
        request.post('POST', 'admin', postData, function(res, chunk) {
            unitTest.equal(res.statusCode, 200);
            response = JSON.parse(chunk);
            unitTest.notEqual(response._id, null);
            //move to get user
            getAdmin(unitTest, response);
        });
    
    });
};

var updateAdmin = function(test, obj, callback) {
    unitTest = test;
    resObject = obj;
    var postData = querystring.stringify({
        "email" : "admin@domain.com1",
        "password": "password1",
        "active": false
    });
    request.post('PUT', 'admin/' + resObject._id, postData, function(res, chunk) {
        unitTest.equal(res.statusCode, 200);
        callback();
    });
}

var getAdmin = function(test, obj) {
    unitTest = test;
    resObject = obj;
    updateAdmin(unitTest, obj, function() {
        request.get('admin/' + resObject._id, function(res, chunk) {
            unitTest.equal(res.statusCode, 200);
            var response = JSON.parse(chunk);
            unitTest.notEqual(resObject.email, response.email);
            unitTest.equal(response.password, null); //don't return password
            deleteAdmin(unitTest, response); //move to delete user
        });
    });
};

var getList = function(c) {
    callback = c;
    request.get('admin/', function(res, chunk) {
        response = JSON.parse(chunk);
        callback(response.length);
    });
};

var deleteAdmin = function(test, obj) {
    unitTest = test;
    resObject = obj;
    request.post('DELETE', 'admin/' + resObject._id, '', function(res, chunk) {
        unitTest.equal(res.statusCode, 200);
        getList(function(num) {
            unitTest.equal(adminNumber, num);
            unitTest.done();
        });
    });
};

//tryes to creat a new admin
exports.testAdmin = function(test) {
    test.expect(8);
    startTest(test);
}