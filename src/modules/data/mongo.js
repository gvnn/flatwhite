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
                        try {
                            coll.insert(obj, function(err, docs) {
                                self.client.close();
                                //the returned object is a collection
                                //returns the first item
                                callback(err, docs[0]);
                            });
                        } catch(err) {
                            callback(err, null);
                        }
                    });
                });
            },
            
            get: function(id, c) {
                var item_id = id;
                var callback = c;
                self.client.open(function(err, p_client) {
                    utils.log("collection selected: " + collection_name);
                    self.client.collection(collection_name, function (err, coll) {
                        try {
                            _bson_id = new self.client.bson_serializer.ObjectID(item_id);
                            coll.findOne({ _id : _bson_id }, function(err, doc) {
                                self.client.close();
                                callback(err, doc);
                            });
                        } catch(err) {
                            callback(err, null);
                        }
                    });
                });
            },
            
            remove: function(id, c) {
                var item_id = id;
                var callback = c;
                self.client.open(function(err, p_client) {
                    utils.log("collection selected: " + collection_name);
                    self.client.collection(collection_name, function (err, coll) {
                        try {
                            _bson_id = new self.client.bson_serializer.ObjectID(item_id);
                            coll.remove({ _id : _bson_id }, function(err, doc) {
                                self.client.close();
                                callback(err, doc);
                            });
                        } catch(err) {
                            callback(err, null);
                        }
                    });
                });
            },
            
            update: function(id, o, c) {
                var obj = o;
                var callback = c;
                var item_id = id;
                
                self.client.open(function(err, p_client) {
                    utils.log("collection selected: " + collection_name);
                    self.client.collection(collection_name, function (err, coll) {
                        try {
                            _bson_id = new self.client.bson_serializer.ObjectID(item_id);
                            coll.update({ _id: _bson_id }, obj, { safe:true }, function(err) {
                                callback(err);
                            });
                        } catch(err) {
                            callback(err, null);
                        }
                    });
                });
            },
            
            list: function(f, c) {
                var fields = f;
                var callback = c;
                self.client.open(function(err, p_client) {
                    utils.log("collection selected: " + collection_name);
                    self.client.collection(collection_name, function (err, coll) {
                        try {
                            mongo_fields = {};
                            for (var i=0; i < fields.length; i++) {
                                mongo_fields[fields[i]] = 1;
                            }
                            
                            coll.find({}, mongo_fields ).toArray(function(err, docs) {
                                self.client.close();
                                callback(err, docs);
                            });
                        } catch(err) {
                            callback(err, null);
                        }
                    });
                });
            }
        };
        
        return coll;
    }
}

module.exports = repository;