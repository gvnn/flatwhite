var config = require("../../src/config");
var http = require("http");

var request = (function () {
    
    var VERSION = '1';
    
    var module = {};
    
    module.get = function(path, callback) {
        
        var getOptions = {
            host: config.server.ip,
            port: config.server.port,
            path: '/' + VERSION + '/' + path,
            method: 'GET'
        };
    
        var getRequest = http.request(getOptions, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                callback(res, chunk);
            });
        });
    
        getRequest.end();
    };
    
    module.post = function(method, path, postData, callback) {
        
        if(method == '') {
            method = 'POST';
        }
        
        var postOptions = {
            host: config.server.ip,
            port: config.server.port,
            path: '/' + VERSION + '/' + path,
            method: method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };
        
        var postRequest = http.request(postOptions, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                callback(res, chunk);
            });
        });
        
        postRequest.write(postData);
        postRequest.end();
    };
    
    return module;

}());

module.exports = request;