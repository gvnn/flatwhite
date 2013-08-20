var connect = require('connect'),
    config = require('../config'),
    utils = require("../utils"),
    fs = require('fs'),
    data = require("./data");
    
var files = (function () {
    
    var module = {};
    
    module.version = 1;
    
    module.execute = function (method, req, res, next) {
        try {
            switch(method) {
                case "post":
                    //new file
                    executePost(req, res);
                    break;
                case "delete":
                    //delete file
                    executeDelete(req, res);
                    break;
                case "get":
                    //list of files
                    executeGet(req, res);
                    break;
            }
        } catch(err) {
                utils.log(err, true);
                utils.responseError(res, err);
        }
    };
    
    var executeDelete = function(req, res) {
        utils.log("file delete");
        itemId = req.params.item != null ? req.params.item : "";
        if(itemId != "") {
            module.deleteFile(itemId, function(err, obj) {
                if(err) {
                    utils.log("error in delete file", true);
                    utils.responseError(res, err);
                } else {
                    utils.log("file deleted successfully");
                    utils.response(res, "deleted file " + itemId);
                }
            });
        } else {
            utils.log("invalid file id", true);
            utils.responseError(res, "invalid content item id");
        }
    };
    
    var executePost = function(req, res) {
        //it saves only on file... deal with it
        for(var file in req.files) {
            if(req.files[file] != null) {
                //save file in db
                data.instance().collection("files").add(
                        {
                            "tmpPath": req.files[file].path,
                            "filename": req.files[file].filename,
                            "length": req.files[file].length,
                            "type": req.files[file].type,
                            "extension": utils.getFileExtension(req.files[file].filename)
                        },
                        function(err, obj) {
                            if(err) {
                                utils.log("error in add file", true);
                                utils.responseError(res, err);
                            } else {
                                //move file
                                fs.rename(obj.tmpPath, 
                                        config.files.repoDir + "/" + obj._id + "." + utils.getFileExtension(obj.filename), 
                                        function() {
                                            //response obj
                                            utils.log("item uploaded successfully");
                                            utils.responseObject(res, obj);
                                        });
                            }
                        }
                    );
            } else {
                utils.badRequest(res, "forgot something?");
            }
        }
    };
    
    module.deleteFile = function(id, callback) {
        data.instance().collection("files").get(id, function(err, objFound) {
            if(objFound != null) {
                data.instance().collection("files").remove(id, function(err, obj) {
                    //remove file
                    fs.unlink(config.files.repoDir + "/" + objFound._id + "." + objFound.extension, function (err) {
                        if (err) throw err;
                        callback(err, null);
                    });
                });
            } else {
                callback("not found", null);
            }
        });
    };
    
    var executeGet = function(req, res) {
        var page = req.query.page != null ? req.query.page : 1;
        var size = req.query.size != null ? req.query.size : 10;
        var fields = req.query.fields != null ? req.query.fields : "";
        var orderby = req.query.orderby != null ? req.query.orderby : "_id";
        var orderdirection = req.query.orderdirection != null ? req.query.orderdirection : "asc";
        
        utils.log("get files page " + page + " size " + size);
        module.getFiles(page, size, fields, orderby, orderdirection, function(err, obj) {
            if(err) {
                utils.log("error getting items", true);
                utils.responseError(res, err);
            } else {
                utils.log("items returned successfully");
                utils.responseObject(res, obj);
            }
        });
    };
    
    module.getFiles = function(page, size, fields, orderby, orderdirection, callback) {
        var queryFields = [];
        if (fields.length > 0) {
            queryFields = fields.split(",")
        };
        
        var skip = size * (page - 1);
        
        var orderObj = {};
        orderObj[orderby] = (orderdirection == "asc" ? 1 : -1);
        
        data.instance().collection("files").list({}, queryFields, callback, skip, size, orderObj);
    };
    
    return module;
    
}());

module.exports = files;