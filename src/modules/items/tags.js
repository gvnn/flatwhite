var data = require("../data");

var tags = (function () {
    
    var module = {};
    
    module.version = 1;
    
    module.addTag = function(itemId, tags, callback) {
        data.instance().collection("items").push(itemId, { tags: tags }, callback);
    };
    
    return module;
    
}());

module.exports = tags;