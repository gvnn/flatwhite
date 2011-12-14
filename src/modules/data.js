var utils = require("../utils");
var config = require('../config');


var data = (function () {

    var module = {};
    
    module.instance = function() {
        if(!module.config) {
            module.config = config.data.repositories[config.data.selected_repository];
            utils.log('selected data module: ' + module.config.name);
        }
        repo = require("./data/" + module.config.name);
        repo.setup(); //will be deleted
        return repo;
    };
    
    return module;
    
}());

module.exports = data;