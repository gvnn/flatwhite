var connect = require('connect'),
    config = require('../config'),
    utils = require("../utils"),
    data = require("./data");
    
var files = (function () {
    
    var module = {};
    
    module.version = 1;
    
    module.execute = function (method, req, res, next) {
        //TODO
        //add file to database
        //move file
        //return file obj
        utils.notFound(res, null);
    };
    
    return module;
    
}());

module.exports = files;