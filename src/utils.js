var config = require('./config');

exports.badRequest = function(res, message) {
    if (res) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: message }));
    }
};

exports.notFound = function(res, message) {
    if (res) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        if(res.jsonCallback != null) {
            //encapsulate obj
            if(isValidFunctionName(res.jsonCallback)) {
                res.end(res.jsonCallback + "(" + JSON.stringify({ error: message }) + ")");
            }
        }
        //standard
        res.end(JSON.stringify({ error: message }));
    }
};

exports.getFileExtension = function(filename) {
    return filename.split('.').pop();
};

exports.response = function(res, msg) {
    this.responseObject(res, { msg : msg });
};

exports.responseObject = function(res, obj) {
    if(res) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        if(res.jsonCallback != null) {
            //encapsulate obj
            if(isValidFunctionName(res.jsonCallback)) {
                res.end(res.jsonCallback + "(" + JSON.stringify(obj) + ")");
            }
        }
        //standard
        res.end(JSON.stringify(obj));
    }
};

exports.log = function(message, error) {
    if(config.logs.enabled) {
        if(error) {
            console.log("\033[90m" + (new Date().toUTCString())
                    + " \033[91m" + message + "\033[0m");
        } else {
            console.log("\033[90m" + (new Date().toUTCString())
                    + " \033[97m" + message + "\033[0m");
        }
    }
};

exports.responseError = function(res, msg) {
    if(res) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        if(res.jsonCallback != null) {
            //encapsulate obj
            if(isValidFunctionName(res.jsonCallback)) {
                res.end(res.jsonCallback + "(" + JSON.stringify({ err: msg }) + ")");
            }
        }
        //standard
        res.end(JSON.stringify({ err: msg }));
    }
};

var isValidFunctionName = function() {
    var validName = /^[$A-Za-z_][0-9A-Za-z_]*$/;
    var reserved = {};
    return function(s) {
        return (validName(s) && !reserved[s]) ? true : false;
    };
};

module.exports = exports;