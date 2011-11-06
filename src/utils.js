exports.bad_request = function(res, message) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: message }));
};

module.exports = exports;