var config = require("../src/config");
var querystring = require("querystring");
var http = require("http");
var unit_test, client;

//tryes to creat a new admin
exports.test_add_admin = function(test) {
    unit_test = test;
    
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
            try {
                unit_test.equal(res.statusCode, 200);
                response = JSON.parse(chunk);
                unit_test.notEqual(response._id, null);
            } catch(e) {
                unit_test.ok(false);
            }
            unit_test.done();
        });
    });
    
    post_req.write(post_data);
    post_req.end();
}