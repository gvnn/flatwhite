var utils = require("../utils");
var data = require("./data");
var itemTags = require("./items/itemTags");
var itemFiles = require("./items/itemFiles");

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
                case "get":
                    //get item
                    executeGet(req, res);
                    break;
                case "delete":
                    //delete item
                    executeDelete(req, res);
                    break;
                case "put":
                    //update
                    executePut(req, res);
                    break;
            }
        } catch(err) {
            utils.log(err, true);
            utils.responseError(res, err);
        }
    };
    
    var executePost = function(req, res) {
        //check if the action is related to a child item
        if(req.params.child) {
            //execute child module
            switch(req.params.child) {
                case "tags":
                    //add tag
                    itemTags.addTag(req.params.item, req.body.tag.split(","), function(err, obj) {
                        if(err) {
                            utils.log("error adding tag", true);
                            utils.responseError(res, err);
                        } else {
                            utils.log("tag added successfully");
                            utils.responseObject(res, obj);
                        }
                    });
                    break;
                case "files":
                    //add file
                    url = req.body.url != null ? req.body.url : "";
                    type = req.body.type != null ? req.body.type : "";
                    itemFiles.addFile(req.params.item, [{"url": url, "type": type}], function(err, obj) {
                        if(err) {
                            utils.log("error adding file", true);
                            utils.responseError(res, err);
                        } else {
                            utils.log("file added successfully");
                            utils.responseObject(res, obj);
                        }
                    });
                    break;
            }
        } else {
            utils.log("new content item");
            
            title = req.body.title != null ? req.body.title : "";
            summary = req.body.summary != null ? req.body.summary : "";
            text = req.body.text != null ? req.body.text : "";
            code = req.body.code != null ? req.body.code : "";
            active = req.body.active != null ? req.body.active : "false";
            tags = req.body.tags != null ? req.body.tags.split(",") : [];
            
            utils.log("adding item: " + code);
            
            module.addItem({
                title: title, 
                summary: summary, 
                text: text, 
                code: code,
                active: active,
                tags: tags,
                files: []
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
    
    var executeDelete = function(req, res) {
        utils.log("content item delete");
        itemId = req.params.item != null ? req.params.item : "";
        if(itemId != "") {
            if(req.params.child) {
                //execute child module
                switch(req.params.child) {
                    case "tags":
                        //delete tag
                        itemTags.deleteTag(req.params.item, req.body.tag.split(","), function(err, obj) {
                            if(err) {
                                utils.log("error adding tag", true);
                                utils.responseError(res, err);
                            } else {
                                utils.log("tag added successfully");
                                utils.responseObject(res, obj);
                            }
                        });
                        break;
                    case "files":
                        //delete file
                        url = req.body.url != null ? req.body.url : "";
                        type = req.body.type != null ? req.body.type : "";
                        itemFiles.deleteFile(req.params.item, [{"url": url, "type": type}], function(err, obj) {
                            if(err) {
                                utils.log("error adding file", true);
                                utils.responseError(res, err);
                            } else {
                                utils.log("file added successfully");
                                utils.responseObject(res, obj);
                            }
                        });
                        break;
                }
            } else {
                //delete item
                module.deleteItem(itemId, function(err, obj) {
                    if(err) {
                        utils.log("error in delete item", true);
                        utils.responseError(res, err);
                    } else {
                        utils.log("content item deleted successfully");
                        utils.response(res, "deleted content item " + itemId);
                    }
                });
            }
        } else {
            utils.log("invalid content item id", true);
            utils.responseError(res, "invalid content item id");
        }
    };
    
    var executeGet = function(req, res) {
        //first search by id, otherwise by code
        itemId = req.params.item != null ? req.params.item : "";
        utils.log("item get");
        module.getItem(itemId, function(err, obj) {
            if(err) {
                utils.log("error searching content item, search by code", true);
                
                module.getItemByCode(itemId, function(err, obj) {
                    if(err) {
                        utils.log("error in retrieve item", true);
                        utils.responseError(res, err);
                    } else {
                        utils.log(obj == null ? "item null" : "item returned successfully");
                        utils.responseObject(res, obj);
                    }
                });
                
            } else {
                utils.log(obj == null ? "item not found" : "item returned successfully");
                if(obj == null) {
                    utils.notFound(res, obj);
                } else {
                    utils.responseObject(res, obj);
                }
            }
        });
    };
    
    var executePut = function(req, res) {
        utils.log("update item");
        
        itemId = req.params.item != null ? req.params.item : "";
        itemToUpdate = {};
        
        //updates only the necessary
        if(req.body.title != null) {
            itemToUpdate["title"] = req.body.title;
        }
        
        if(req.body.summary != null) {
            itemToUpdate["summary"] = req.body.summary;
        }
        
        if(req.body.text != null) {
            itemToUpdate["text"] = req.body.text;
        }
        
        if(req.body.code != null) {
            itemToUpdate["code"] = req.body.code;
        }
        
        if(req.body.active != null) {
            itemToUpdate["active"] = Boolean(req.body.active);
        }
        
        if(itemId != "") {
            utils.log("update item: " + itemId);
            module.updateItem(itemId, 
                itemToUpdate
                , function(err, obj) {
                    if(err) {
                        utils.log("error updating item", true);
                        utils.responseError(res, err);
                    } else {
                        utils.log("item updated successfully");
                        utils.response(res, "updated item " + itemId);
                    }
                });
        } else {
            utils.log("invalid id", true);
            utils.responseError(res, "invalid id");
        }
    };
    
    module.addItem = function(item, callback) {
        //if code is not empty check if another one exists
        if(item.code) {
            module.getItemByCode(item.code, function(err, obj) {
                if(obj.length > 0) {
                    callback("error updating item, code already exists. choose a different code or live it empty", null);
                } else {
                    data.instance().collection("items").add({ 
                            title: item.title,
                            summary: item.summary,
                            text: item.text,
                            code: item.code,
                            active: Boolean(item.active),
                            tags: item.tags,
                            files: item.files
                        }, callback);
                }
            });
        } else {
            data.instance().collection("items").add({ 
                    title: item.title,
                    summary: item.summary,
                    text: item.text,
                    code: item.code,
                    active: Boolean(item.active),
                    tags: item.tags,
                    files: item.files
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
        if(item.code != null) {
            module.getItemByCode(item.code, function(err, obj) {
                if(obj.length > 0) {
                    callback("error updating item, code already exists. choose a different code or live it empty", null);
                } else {
                    data.instance().collection("items").update(id, item, callback);
                }
            });
        } else {
            data.instance().collection("items").update(id, item, callback);
        }
    };
    
    return module;
    
}());

module.exports = items;