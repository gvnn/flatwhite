var connect = require('connect'),
    config = require('../config'),
    utils = require("../utils"),
    data = require("./data");
    
var files = (function () {
    
    var module = {};
    
    module.version = 1;
    
    module.execute = function (method, req, res, next) {
        console.log(req.files);
    };
    
    return module;
    
}());

module.exports = files;