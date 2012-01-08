var utils = require("../utils");
var data = require("./data");
var tags = require("./items/tags");
var images = require("./items/images");

/*
Content items manager
*/
var items = (function () {
    
    var module = {};
    
    module.version = 1;
    
    module.execute = function (method, req, res, next) {
        try {
            switch(method) {
                case "post":
                    //new item
                    executePost(req, res);
                    break;
            }
        } catch(err) {
            utils.log(err, true);
            utils.responseError(res, err);
        }
    };
    
    executePost = function(req, res) {
        //check if the action is related to a child item
        if(req.params.child) {
            //execute child module
        } else {
            utils.log("new content item");
            
            title = req.body.title != null ? req.body.title : "";
            summary = req.body.summary != null ? req.body.summary : "";
            text = req.body.text != null ? req.body.text : "";
            code = req.body.code != null ? req.body.code : "";
            active = req.body.active != null ? req.body.active : "false";
            
            utils.log("adding item: " + code);
            
            module.addItem({
                title: title, 
                summary: summary, 
                text: text, 
                code: code
            }, function(err, obj) {
                if(err) {
                    utils.log("error adding content item", true);
                    utils.responseError(res, err);
                } else {
                    utils.log("content item added successfully");
                    utils.responseObject(res, obj);
                }
            });
        }
    };
    
    module.addItem = function(item, callback) {
        //if code is not empty check if another one exists
        if(item.code) {
            module.getItemByCode(item.code, function(err, obj) {
                if(obj.length > 0) {
                    throw "error adding item, code already exists. choose a different code or live it empty";
                } else {
                    data.instance().collection("items").add({ 
                            title: item.title,
                            summary: item.summary,
                            text: item.text,
                            code: item.code,
                            active: Boolean(item.active) 
                        }, callback);
                }
            });
        } else {
            data.instance().collection("items").add({ 
                    title: item.title,
                    summary: item.summary,
                    text: item.text,
                    code: item.code,
                    active: Boolean(item.active) 
                }, callback);
        }
    };
    
    module.getItemByCode = function(code, callback) {
        data.instance().collection("items").list({code: code}, [], callback);
    };
    
    module.getItem = function(id, callback) {
        data.instance().collection("items").get(id, callback);
    };
    
    module.deleteItem = function(id, callback) {
        data.instance().collection("items").remove(id, callback);
    };
    
    module.updateItem = function(id, item, callback) {
        //if code is not empty check if another one exists
        if(item.code) {
            module.getItemByCode(item.code, function(err, obj) {
                if(obj.length > 0) {
                    throw "error updating item, code already exists. choose a different code or live it empty";
                } else {
                    data.instance().collection("admin").update(id, { 
                        title: item.title,
                        summary: item.summary,
                        text: item.text,
                        code: item.code,
                        active: Boolean(item.active)
                    }, callback);
                }
            });
        } else {
            data.instance().collection("admin").update(id, { 
                title: item.title,
                summary: item.summary,
                text: item.text,
                code: item.code,
                active: Boolean(item.active)
            }, callback);
        }
    };
    
    return module;
    
}());

module.exports = items;