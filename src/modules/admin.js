var utils = require("../utils");
var data = require("./data");
var crypto = require("crypto");

/*
This module manages 
*/

var admin = {

    execute: function(method, req, res, next) {
        switch(method) {
            case "post":
                //new admin
                this.add(req, res);
                break;
            case "get":
                this.get(req, res);
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
        utils.log("admin get");
        admin_id = req.params.item != null ? req.params.item : "";
        if(admin_id != "") {
            data.instance().collection("admin").get(admin_id, function(err, obj) {
                if(err) {
                    utils.log("error in gettin admin", true);
                    utils.response_err(res, err);
                } else {
                    utils.log("admin returned successfully");
                    utils.response_obj(res, obj);
                }
            });
        } else {
            utils.log("fields missing", true);
            utils.response_err(res, "fields missing");
        }
    }
};

module.exports = admin;