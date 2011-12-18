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
                this.add(req, res);
                break;
            case "get":
                //get admin details
                this.get(req, res);
                break;
            case "delete":
                //delete admin
                this.deleteAdmin(req, res);
                break;
            case "put":
                //update
                this.update(req, res);
                break;
        }
    };
    
    // function that adds a new admin.
    // parameters:
    // - email: used also as username
    // - password: password in clear, will be stored in md5
    // - active: true/false
    module.add = function(req, res) {
        utils.log("new admin");
        var self = this;
        
        email = req.body.email != null ? req.body.email : "";
        password = req.body.password != null ? req.body.password : "";
        active = req.body.active != null ? req.body.active : "false";
        
        if(email != "" && password != "") {
            utils.log("adding user: " + email);
            data.instance().collection("admin").add({ email: email, password: crypto.createHash('md5').update(password).digest("hex"), active: Boolean(active) }, function(err, obj) {
                if(err) {
                    utils.log("error adding admin", true);
                    utils.responseError(res, err);
                } else {
                    utils.log("admin added successfully");
                    utils.responseObject(res, obj);
                }
            });
        } else {
            utils.log("fields missing", true);
            utils.responseError(res, "fields missing");
        }
    };
    
    // function that retrieves a single admin or the list of all admin
    module.get = function(req, res) {
        adminId = req.params.item != null ? req.params.item : "";
        if(adminId != "") {
            utils.log("admin get");
            data.instance().collection("admin").get(adminId, function(err, obj) {
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
            data.instance().collection("admin").list(["email", "active"], function(err, objs) {
                if(err) {
                    utils.log("error in retrieve list", true);
                    utils.responseError(res, err);
                } else {
                    utils.responseObject(res, objs);
                }
            });
        }
    };
    
    // function that deletes an admin
    module.deleteAdmin = function(req, res) {
        utils.log("admin delete");
        adminId = req.params.item != null ? req.params.item : "";
        if(adminId != "") {
            data.instance().collection("admin").remove(adminId, function(err, obj) {
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
    
    module.update = function(req, res) {
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

    return module;
    
}());

module.exports = admin;