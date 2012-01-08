var utils = require("../utils");
var config = require('../config');


var data = (function () {

    var module = {};
    
    module.version = 1;
    
    module.instance = function() {
        if(!module.config) {
            module.config = config.data.repositories[config.data.selectedRepository];
            utils.log('selected data module: ' + module.config.name);
        }
        repo = require("./data/" + module.config.name);
        return repo;
    };
    
    return module;
    
}());

module.exports = data;