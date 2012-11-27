/**
 * Basic http authentication provider. Uses the database to validate credentials.
 *
 */
var connect = require('connect'),
    data = require("../data"),
    utils = require("../../utils"),
    crypto = require("crypto"),
    unauthorized = connect.utils.unauthorized;

var basicDatabase = (function () {

    var module = {};
    
    module.authenticate = function(req, res, next) {
        if (req.method == 'GET'){
            return next();
        } else {
            var realm = 'Authorization Required';
            var authorization = req.headers.authorization;
            if (req.remoteUser) next();
            if (!authorization) return unauthorized(res, realm);
            
            var parts = authorization.split(' '),
                        scheme = parts[0],
                        credentials = new Buffer(parts[1], 'base64').toString().split(':');

            if ('Basic' != scheme) return next(400);
            
            module.validate(credentials[0], credentials[1], function(result){
                if (result) {
                    req.remoteUser = credentials[0];
                    utils.log("user authenticated: " + req.remoteUser);
                    next();
                } else {
                    unauthorized(res, realm);
                }
            });
        }
    };
    
    module.validate = function(username, password, c) {
        var callback = c;
        data.instance().collection("admin").list({
            email: username,
            password: crypto.createHash('md5').update(password).digest("hex") }, [],
        function(err, objs) {
             c(objs.length > 0);
        });
    };
    
    return module;

}());

module.exports = basicDatabase;