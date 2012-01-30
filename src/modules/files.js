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
    
    return module;
    
}());

module.exports = files;