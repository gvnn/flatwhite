var utils = require("../utils");
var data = require("./data");
var crypto = require("crypto");

/*
Admin manager module
*/
var admin = {

    execute: function(method, req, res, next) {
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
                this.delete_admin(req, res);
                break;
            case "put":
                break;
        }
    },

    // function that adds a new admin.
    // parameters:
    // - email: used also as username
    // - password: password in clear, will be stored in md5
    // - active: true/false
    add: function(req, res) {
        utils.log("new admin method called");
        
        var self = this;
        
        email = req.body.email != null ? req.body.email : "";
        password = req.body.password != null ? req.body.password : "";
        active = req.body.active != null ? req.body.active : "false";
        
        if(email != "" && password != "") {
            utils.log("adding user: " + email);
            data.instance().collection("admin").add({ email: email, password: crypto.createHash('md5').update(password).digest("hex"), active: Boolean(active) }, function(err, obj) {
                if(err) {
                    utils.log("error in adding admin", true);
                    utils.response_err(res, err);
                } else {
                    utils.log("admin added successfully");
                    utils.response_obj(res, obj);
                }
            });
        } else {
            utils.log("fields missing", true);
            utils.response_err(res, "fields missing");
        }
    },
    
    // function that retrieves an admin object
    // parameters:
    // - _id: admin's id
    get: function(req, res) {
        admin_id = req.params.item != null ? req.params.item : "";
        if(admin_id != "") {
            utils.log("admin get");
            data.instance().collection("admin").get(admin_id, function(err, obj) {
                if(err) {
                    utils.log("error in retrieve admin", true);
                    utils.response_err(res, err);
                } else {
                    utils.log("admin returned successfully");
                    utils.response_obj(res, obj);
                }
            });
        } else {
            utils.log("admin list");
            //returns a list of all admins
            data.instance().collection("admin").list(["email", "active"], function(err, objs) {
                if(err) {
                    utils.log("error in retrieve list", true);
                    utils.response_err(res, err);
                } else {
                    utils.response_obj(res, objs);
                }
            });
        }
    },
    
    delete_admin: function(req, res) {
        utils.log("admin delete");
        admin_id = req.params.item != null ? req.params.item : "";
        if(admin_id != "") {
            data.instance().collection("admin").remove(admin_id, function(err, obj) {
                if(err) {
                    utils.log("error in delete admin", true);
                    utils.response_err(res, err);
                } else {
                    utils.log("admin deleted successfully");
                    utils.response_msg(res, "deleted admin " + admin_id);
                }
            });
        } else {
            utils.log("invalid admin id", true);
            utils.response_err(res, "invalid admin id");
        }
    }
};

module.exports = admin;