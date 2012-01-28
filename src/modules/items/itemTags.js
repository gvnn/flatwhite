var data = require("../data");

var itemTags = (function () {
    
    var module = {};
    
    module.version = 1;
    
    module.addTag = function(itemId, tags, callback) {
        data.instance().collection("items").push(itemId, { tags: tags }, callback);
    };
    
    module.deleteTag = function(itemId, tags, callback) {
        data.instance().collection("items").pull(itemId, { tags: tags }, callback);
    }
    
    return module;
    
}());

module.exports = itemTags;