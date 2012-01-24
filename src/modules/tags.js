var connect = require('connect'),
    config = require('../config'),
    utils = require("../utils");
    
var tags = (function () {
    
    var module = {};
    
    module.version = 1;
    
    module.execute = function (method, req, res, next) {
        try {
            switch(method) {
                case "get":
                    //get items
                    executeGet(req, res);
                    break;                
            }
        } catch(err) {
            utils.log(err, true);
            utils.responseError(res, err);
        }
    };
    
    executeGet = function(req, res) {
        page = req.query.page != null ? req.query.page : 1;
        size = req.query.size != null ? req.query.size : 10;
        tag = req.params.item != null ? req.params.item : "";
        utils.log("get items by tags, page " + page + " size " + size + " tag " + tag);
    };
    
    module.getItems = function(page, size, tag, callback) {
        
    };
    
    return module;
    
}());

module.exports = tags;