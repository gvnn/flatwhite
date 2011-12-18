exports.badRequest = function(res, message) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: message }));
};

exports.response = function(res, msg) {
    this.responseObject(res, { msg : msg });
};

exports.responseObject = function(res, obj) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
};

exports.log = function(message, error) {
    if(error) {
        console.log("\033[90m" + (new Date().toUTCString())
                + " \033[91m" + message + "\033[0m");
    } else {
        console.log("\033[90m" + (new Date().toUTCString())
                + " \033[97m" + message + "\033[0m");
    }
};

exports.responseError = function(res, msg) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ err: msg }));
};

module.exports = exports;