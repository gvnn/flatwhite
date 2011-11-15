/**
 * Basic http authentication provider. Uses the database to validate credentials.
 *
 */
var connect = require('connect'),
    unauthorized = connect.utils.unauthorized;

var basicDatabase = {

    authenticate: function(req, res, next) {
        
        var realm = 'Authorization Required';
        var authorization = req.headers.authorization;
        if (req.remoteUser) return next();
        if (!authorization) return unauthorized(res, realm);
        
        var parts = authorization.split(' '), 
                    scheme = parts[0],
                    credentials = new Buffer(parts[1], 'base64').toString().split(':');

        if ('Basic' != scheme) return next(400);
        
        if (basicDatabase.validate(credentials[0], credentials[1])) {
            //TODO: save admin's id
            req.remoteUser = credentials[0];
            console.log("user authenticated: " + req.remoteUser);
            next();
        } else {
            unauthorized(res, realm);
        }
    },
    
    validate: function(username, password) {
        //TODO: attach to database
        return (username == "username" && password == "password");
    }
};

module.exports = basicDatabase;