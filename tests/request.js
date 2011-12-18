var config = require("../src/config");
var querystring = require("querystring");
var http = require("http");

var request = (function () {
    
    var VERSION = '1';
    
    var module = {};
    
    module.get = function(path, callback) {
        
        var get_options = {
            host: config.server.ip,
            port: config.server.port,
            path: '/' + VERSION + '/' + path,
            method: 'GET'
        };
    
        var get_req = http.request(get_options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                callback(res, chunk);
            });
        });
    
        get_req.end();
        
    };
    
    module.post = function(method, path, post_data, callback) {
        
        if(method == '') {
            method = 'POST';
        }
        
        var post_options = {
            host: config.server.ip,
            port: config.server.port,
            path: '/' + VERSION + '/' + path,
            method: method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': post_data.length
            }
        };
        
        var post_req = http.request(post_options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                callback(res, chunk);
            });
        });
    
        post_req.write(post_data);
        post_req.end();
        
    };
    
    return module;

}());

module.exports = request;