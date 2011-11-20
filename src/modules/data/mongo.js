var mongodb = process.env['TEST_NATIVE'] != null ? require('mongodb').native() : require('mongodb').pure();
var Db = mongodb.Db, Server = mongodb.Server;
var config = require("../../config");
var utils = require("../../utils");

var repository = {
    
    setup: function() {
	    this.db_conf = config.data.repositories[config.data.selected_repository];
        this.client = new Db(this.db_conf.db, new Server(this.db_conf.server, this.db_conf.port, {}));
	},
	
	collection: function(name) {
	    
	    var self = this;
	    var collection_name = config.data.collections_prefix + name;
	    
	    //collection object
	    var coll = {
	        add: function(o, c) {
	            var obj = o;
                var callback = c;
                self.client.open(function(err, p_client) {
                    utils.log("collection selected: " + collection_name);
                    self.client.collection(collection_name, function (err, coll) {
                        coll.insert(obj, function(err, docs) {
                            self.client.close();
                            //the returned object is a collection
                            //returns the first item
                            callback(err, docs[0]);
                        });
                    });
                });                
	        },
	        
	        get: function(id, c) {
	            var item_id = id;
                var callback = c;
                self.client.open(function(err, p_client) {
                    utils.log("collection selected: " + collection_name);
                    self.client.collection(collection_name, function (err, coll) {
                        _bson_id = new self.client.bson_serializer.ObjectID(item_id);
                        coll.findOne({ _id : _bson_id }, function(err, doc) {
                            self.client.close();
                            callback(err, doc);
                        });
                    });
                });                
	        },
	        
	        delete: function() {
	            
	        }
	    };
        return coll;
	}
}

module.exports = repository;