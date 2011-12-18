var request = require("./request");
var querystring = require("querystring");
var unitTest, client;

exports.testAuth = function(test) {
    
    //add admin not via REST but calling the actual method in the library
    var admin = require("../src/modules/admin");
    admin.add({
        body: {
            "email" : "admin@domain.com",
            "password": "password",
            "active": true
        }
    }, null);
    
    //delete admin
    
};