var admin = require("../../src/modules/admin");
var auth = require("../../src/modules/auth/basicDatabase");
var config = require("../../src/config");

exports.testAuth = function(test) {
    config.logs.enabled = false;
    var unitTest = test;
    unitTest.expect(2);
    //add admin
    admin.addAdmin({
            email: "admin@domain.com",
            password: "password",
            active: true
            },function(err, obj) {
                var newAdmin = obj;
                if(err) {
                    test.ok(false);
                } else {
                    //validate
                    auth.validate("admin@domain.com", "password", function(result) {
                        unitTest.ok(result);
                        //delete admin
                        admin.deleteAdmin(String(newAdmin._id), function(err, obj) {
                            //double check
                            auth.validate("admin@domain.com", "password", function(result) {
                                unitTest.ok(!result);
                                unitTest.done();
                            });
                        });
                    }); 
                }
            });
};