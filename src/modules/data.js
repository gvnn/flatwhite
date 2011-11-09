var config = require('../config');

exports.instance = function() {
    this.repository_config = config.data.repositories[config.data.selected_repository];
    repo = require("./data/" + this.repository_config.name);
    repo.setup();
    return repo;
};

module.exports = exports;