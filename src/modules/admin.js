var utils = require("../utils");
var data = require("./data");
var crypto = require("crypto");

/*
Admin manager module
*/
var admin = (function () {
    
    var module = {};
    
    module.execute = function (method, req, res, next) {
        switch(method) {
            case "post":
                //new admin
                executePost(req, res);
                break;
            case "get":
                //get admin details
                executeGet(req, res);
                break;
            case "delete":
                //delete admin
                executeDelete(req, res);
                break;
            case "put":
                //update
                executePut(req, res);
                break;
        }
    };
    
    executePost = function(req, res) {
        utils.log("new admin");
        email = req.body.email != null ? req.body.email : "";
        password = req.body.password != null ? req.body.password : "";
        active = req.body.active != null ? req.body.active : "false";
        
        utils.log("adding user: " + admin.email);
        module.addAdmin({
            email: email, 
            password: password, 
            active: active
        }, function(err, obj) {
            if(err) {
                utils.log("error adding admin", true);
                utils.responseError(res, err);
            } else {
                utils.log("admin added successfully");
                utils.responseObject(res, obj);
            }
        });
    };
    
    executeGet = function(req, res) {
        adminId = req.params.item != null ? req.params.item : "";
        if(adminId != "") {
            utils.log("admin get");
            module.getAdmin(adminId, function(err, obj) {
                if(err) {
                    utils.log("error in retrieve admin", true);
                    utils.responseError(res, err);
                } else {
                    utils.log("admin returned successfully");
                    delete obj["password"];
                    utils.responseObject(res, obj);
                }
            });
        } else {
            utils.log("admin list");
            //returns a list of all admins
            module.getAdmins({}, ["email", "active"], function(err, objs) {
                if(err) {
                    utils.log("error in retrieve list", true);
                    utils.responseError(res, err);
                } else {
                    utils.responseObject(res, objs);
                }
            });
        }
    };
    
    executeDelete = function(req, res) {
        utils.log("admin delete");
        adminId = req.params.item != null ? req.params.item : "";
        if(adminId != "") {
            module.deleteAdmin(adminId, function(err, obj) {
                if(err) {
                    utils.log("error in delete admin", true);
                    utils.responseError(res, err);
                } else {
                    utils.log("admin deleted successfully");
                    utils.response(res, "deleted admin " + adminId);
                }
            });
        } else {
            utils.log("invalid admin id", true);
            utils.responseError(res, "invalid admin id");
        }
    };
    
    executePut = function(req, res) {
        utils.log("update admin");
        var self = this;
        
        adminId = req.params.item != null ? req.params.item : "";
        email = req.body.email != null ? req.body.email : "";
        password = req.body.password != null ? req.body.password : "";
        active = req.body.active != null ? req.body.active : "false";
        
        if(adminId != "") {
            utils.log("update user: " + adminId);
            data.instance().collection("admin").update(adminId, { email: email, password: crypto.createHash('md5').update(password).digest("hex"), active: Boolean(active) }, function(err, obj) {
                if(err) {
                    utils.log("error updating admin", true);
                    utils.responseError(res, err);
                } else {
                    utils.log("admin updated successfully");
                    utils.response(res, "updated admin " + adminId);
                }
            });
        } else {
            utils.log("invalid id", true);
            utils.responseError(res, "invalid id");
        }
    };

    module.deleteAdmin = function(id, callback) {
        data.instance().collection("admin").remove(id, callback);
    };

    /**
     * Admin details
     *
     * @param id admin Id
     * @param callback Callback function
     */
    module.getAdmin = function(id, callback) {
        data.instance().collection("admin").get(id, callback);
    };
    
    /**
     * Admins list
     *
     * @param where lists's filters
     * @param fields fields to display on list
     * @param callback Callback function
     */
    module.getAdmins = function(where, fields, callback) {
        data.instance().collection("admin").list(where, fields, callback);
    };
    
    /**
     * Adds a new admin.
     *
     * @param admin admin object
     * @param callback Callback function
     */
    module.addAdmin = function(admin, callback) {
        if(admin.email != "" && admin.password != "") {
            data.instance().collection("admin").add({ 
                    email: admin.email, 
                    password: crypto.createHash('md5').update(admin.password).digest("hex"), 
                    active: Boolean(admin.active) 
                }, callback);
        } else {
            callback("fields missing", null);
        }
    };

    return module;
    
}());

module.exports = admin;