var utils = require("../utils");
var data = require("./data");

var admin = {

    execute: function(method, req, res, next) {
        this.add(res);
    },

    add: function(res) {
        var self = this;
        //whatever parameters
        data.instance().add_admin({email: "info@gvnn.it", password: "", active: true}, function(err, docs) {
            if(err) {
                utils.response_err(res, err);
            } else {
                utils.response(res, docs[0]._id.toString());
            }
        });
    }
};

module.exports = admin;