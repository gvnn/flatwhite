var config = require("../src/config");
var querystring = require("querystring");
var http = require("http");
var unit_test, client;

var start_test = function(test) {
    unit_test = test;
    
    //first test: add admin
    
    var post_data = querystring.stringify({
        "email" : "admin@domain.com",
        "password": "password",
        "active": true
    });
    
    var post_options = {
        host: '127.0.0.1',
        port: config.server.port,
        path: '/1/admin',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length
        }
    };
    
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            unit_test.equal(res.statusCode, 200);
            response = JSON.parse(chunk);
            unit_test.notEqual(response._id, null);
            //move to get user
            get_admin(unit_test, response);
        });
    });
    
    post_req.write(post_data);
    post_req.end();
};

var get_admin = function(test, obj) {
    unit_test = test;
    res_object = obj;
    
    var get_options = {
        host: '127.0.0.1',
        port: config.server.port,
        path: '/1/admin/' + res_object._id,
        method: 'GET'
    };
    
    var get_req = http.request(get_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            unit_test.equal(res.statusCode, 200);
            response = JSON.parse(chunk);
            unit_test.ok(res_object.email == response.email);
            unit_test.ok(res_object.password == response.password);
            unit_test.done();
        });
    });
    
    get_req.end();
}

//tryes to creat a new admin
exports.test_admin = function(test) {
    start_test(test);
}