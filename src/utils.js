exports.bad_request = function(res, message) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: message }));
};

exports.response = function(res, msg) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(msg);
};

exports.response_err = function(res, obj) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(obj);
};

module.exports = exports;