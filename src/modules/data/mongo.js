var mongodb = process.env['TEST_NATIVE'] != null ? require('mongodb').native() : require('mongodb').pure();
var Db = mongodb.Db, Server = mongodb.Server;
var config = require("../../config");

var repository = {
    
    setup: function() {
	    this.db_conf = config.data.repositories[config.data.selected_repository];
        this.client = new Db('test', new Server("127.0.0.1", 27017, {}));
	},
    
    //TODO: wrong, create a generic method for add
    add_admin: function (a, c) {
        var self = this;
        var callback = c;
        var admin = a;
        self.client.open(function(err, p_client) {
            self.client.collection('admins', function (err, collection) {
                collection.insert(admin, function(err, docs) {
                    self.client.close();
                    callback(err, docs);
                });
            });
        });
    }
}

module.exports = repository;