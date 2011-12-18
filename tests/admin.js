var request = require("./request");
var config = require("../src/config");
var querystring = require("querystring");
var http = require("http");
var unit_test, client;
var admin_num = 0;

var start_test = function(test) {
    unit_test = test;

    //get list
    get_list(function(num) {
        admin_num = num;

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
    
    });
};

var update_admin = function(test, obj, callback) {
    unit_test = test;
    res_object = obj;
    
    var post_data = querystring.stringify({
        "email" : "admin@domain.com1",
        "password": "password1",
        "active": false
    });
    
    var post_options = {
        host: '127.0.0.1',
        port: config.server.port,
        path: '/1/admin/' + res_object._id,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length
        }
    };

    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            unit_test.equal(res.statusCode, 200);
            callback();
        });
    });

    post_req.write(post_data);
    post_req.end();
    
}

var get_admin = function(test, obj) {
    unit_test = test;
    res_object = obj;
    
    update_admin(unit_test, obj, function() {
    
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
                
                var response = JSON.parse(chunk);
                
                unit_test.notEqual(res_object.email, response.email);
                unit_test.equal(response.password, null); //don't return password
                delete_admin(unit_test, response); //move to delete user
                
            });
        });
    
        get_req.end();
        
    });
};

var get_list = function(c) {
    callback = c;
    request.get('admin/', function(res, chunk) {
        response = JSON.parse(chunk);
        callback(response.length);
    });
};

var delete_admin = function(test, obj) {
    
    unit_test = test;
    res_object = obj;
    
    var delete_options = {
        host: '127.0.0.1',
        port: config.server.port,
        path: '/1/admin/' + res_object._id,
        method: 'DELETE'
    };
    
    var delete_req = http.request(delete_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            unit_test.equal(res.statusCode, 200);
            
            get_list(function(num) {
                unit_test.equal(admin_num, num);
                unit_test.done();
            });
            
        });
    });
    
    delete_req.end();
};

//tryes to creat a new admin
exports.test_admin = function(test) {
    start_test(test);
}