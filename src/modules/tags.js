var connect = require('connect'),
    config = require('../config'),
    utils = require("../utils"),
    data = require("./data");
    
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
    
    var executeGet = function(req, res) {
        var page = req.query.page != null ? req.query.page : 1;
        var size = req.query.size != null ? req.query.size : 10;
        var fields = req.query.fields != null ? req.query.fields : "";
        var orderby = req.query.orderby != null ? req.query.orderby : "_id";
        var orderdirection = req.query.orderdirection != null ? req.query.orderdirection : "asc";
        var tag = req.params.item != null ? req.params.item : "";
        
        utils.log("get items by tags, page " + page + " size " + size + " tag " + tag);
        module.getItems(page, size, tag, fields, orderby, orderdirection, function(err, obj) {
            if(err) {
                utils.log("error getting items", true);
                utils.responseError(res, err);
            } else {
                utils.log("items returned successfully");
                utils.responseObject(res, obj);
            }
        });
    };
    
    module.getItems = function(page, size, tag, fields, orderby, orderdirection, callback) {
        var queryFields = [];
        if (fields.length > 0) {
            queryFields = fields.split(",")
        };
        
        var skip = size * (page - 1);
        
        var orderObj = {};
        orderObj[orderby] = (orderdirection == "asc" ? 1 : -1);
        
        data.instance().collection("items").list({ "tags" : { $in : [tag] } }, queryFields, callback, skip, size, orderObj);
    };
    
    return module;
    
}());

module.exports = tags;