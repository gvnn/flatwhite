var connect = require('connect'),
    config = require('./config'),
    fs = require('fs'),
    utils = require("./utils");

var loader = function(method, req, res, next) {
    utils.log(method + " - version: " + req.params.version + 
        ", module: " + req.params.module + 
        ", item: " + req.params.item + 
        ", child: " + req.params.child);
        
    //check json callback
    res['jsonCallback'] = req.query.callback != null ? req.query.callback : null;
    utils.log('callback: ' + res.jsonCallback);
    _module = require("./modules/" + req.params.module);
    _module.execute(method, req, res, next);
};

//create server
var server = connect.createServer();

//add body parser for post
server.use(connect.bodyParser({uploadDir: config.files.tmpDir}));

//create temp upload folder and repo
fs.realpath(config.files.tmpDir, function(err, resolvedPath) {
    if(resolvedPath == null) {
        fs.mkdir(config.files.tmpDir, '755', function() {
            utils.log(config.files.tmpDir + " created");
        });
    }
});

fs.realpath(config.files.repoDir, function(err, resolvedPath) {
    if(resolvedPath == null) {
        fs.mkdir(config.files.repoDir, '755', function() {
            utils.log(config.files.repoDir + " created");
        });
    }
});

//add parser for querystring
server.use(connect.query());

//check authentication required
if(config.auth) {
    utils.log("authentication: " + config.auth);
    _auth = require("./modules/auth/" + config.auth);
    server.use('/', _auth.authenticate);
}

//set routes
server.use('/',
    connect.router(function(app) {
        _path = "/:version([0-9]+)/:module([a-z]+)/:item([a-z0-9]+)?/:child([a-z]+)?";
        //Post -> Create
        app.post(_path, function(req, res, next) {
            loader("post", req, res, next);
        });
        //Get -> Read
        app.get(_path, function(req, res, next) {
            loader("get", req, res, next);
        });
        //Put -> Update
        app.put(_path, function(req, res, next) {
            loader("put", req, res, next);
        });
        //Delete -> Delete
        app.del(_path, function(req, res, next) {
            loader("delete", req, res, next);
        });
    })
);

//Uncaught Exceptions
server.use(connect.errorHandler({ showStack: config.errors.showStack, dumpExceptions: config.errors.dumpExceptions }));

//start server
server.listen(config.server.port);
utils.log("flatwhite started on port " + config.server.port);