var data = require("../data");

var itemFiles = (function () {
    
    var module = {};
    
    module.version = 1;
    
    module.addFile = function(itemId, tags, callback) {
        data.instance().collection("items").push(itemId, { files: tags }, callback);
    };
    
    module.deleteFile = function(itemId, tags, callback) {
        data.instance().collection("items").pull(itemId, { files: tags }, callback);
    }
    
    return module;
    
}());

module.exports = itemFiles;