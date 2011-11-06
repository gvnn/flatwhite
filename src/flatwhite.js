var connect = require('connect'),
    config = require('./config');

var loader = function(method, req, res, next) {
    
    console.log(method + " - version: " + req.params.version + 
        ", module: " + req.params.module + 
        ", item: " + req.params.item + 
        ", operation: " + req.params.operation);
                
    _module = require("./modules/" + req.params.module);
    _module.execute(method, req, res, next);
};

//create server
var server = connect.createServer();

//set routes
server.use('/',
    connect.router(function(app){
        _path = "/:version([0-9]+)/:module([a-z]+)/:item([a-z0-9]+)/:operation([a-z]+)?";
        //Post -> Create
        app.post(_path, function(req, res, next){
            loader("post", req, res, next);
        });
        //Get -> Read
        app.get(_path, function(req, res, next){
            loader("get", req, res, next);
        });
        //Put -> Update
        app.put(_path, function(req, res, next){
            loader("put", req, res, next);
        });
        //Delete -> Delete
        app.del(_path, function(req, res, next){
            loader("delete", req, res, next);
        });
    })
);

//Uncaught Exceptions
server.use(connect.errorHandler({ showStack: config.errors.show_stack, dumpExceptions: config.errors.dump_exceptions }));

//start server
server.listen(config.server.port);
console.log("flatwhite started on port " + config.server.port);