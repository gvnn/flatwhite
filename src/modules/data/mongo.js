var mongodb = process.env['TEST_NATIVE'] != null ? require('mongodb').native() : require('mongodb').pure();
var Db = mongodb.Db, Server = mongodb.Server;
var config = require("../../config");
var utils = require("../../utils");

/**
    Mongo db data provider
 */
var mongo = (function () {
    
    var module = {};
    
    module.configuration = config.data.repositories[config.data.selectedRepository];
    module.client = new Db(module.configuration.db, new Server(module.configuration.server, module.configuration.port, {}));
    
    /**
     * Mongo db collection function
     *
     * @param collectionName collection name
     */
    module.collection = function(collectionName) {
        
        var name = config.data.collectionsPrefix + collectionName;
        
        /**
         * Collection Object. Provides all the methods to interact with a mongodb collection
         *
         */
        var collectionObject = {
            
            /**
             * Returns to a callback function the selected collection object
             *
             * @param c callback function
             */
            getCollection: function(c) {
                var callback = c;
                module.client.open(function(err, p_client) {
                    utils.log("collection selected: " + name);
                    module.client.collection(name, function (err, coll) {
                        c(err, coll);
                    });
                });
            },
            
            /**
             * Adds a new item to a collection
             *
             * @param o Object to add
             * @param c Callback function
             */
            add: function(o, c) {
                var obj = o;
                var callback = c;
                this.getCollection(function(err, coll) {
                    try {
                        coll.insert(obj, function(err, docs) {
                            module.client.close();
                            callback(err, docs[0]);
                        });
                    } catch(err) {
                        module.client.close();
                        callback(err, null);
                    }
                });
            },
            
            push: function(id, obj, c) {
                var itemId = id;
                var callback = c;
                var objectToAdd = obj;
                
                this.getCollection(function(err, coll) {
                    try {
                        bsonId = new module.client.bson_serializer.ObjectID(itemId);
                        coll.update({ _id: bsonId }, {"$pushAll": objectToAdd }, { safe:true }, function(err, pushed) {
                            module.client.close();
                            callback(err, pushed);
                        });
                    } catch(err) {
                        callback(err, null);
                    }
                });
            },
            
            pull: function(id, obj, c) {
                var itemId = id;
                var callback = c;
                var collectionToRemove = obj;
                
                this.getCollection(function(err, coll) {
                    try {
                        bsonId = new module.client.bson_serializer.ObjectID(itemId);
                        coll.update({ _id: bsonId }, {"$pullAll": collectionToRemove }, { safe:true }, function(err, pulled) {
                            module.client.close();
                            callback(err, pulled);
                        });
                    } catch(err) {
                        module.client.close();
                        callback(err, null);
                    }
                });
            },
            
            /**
             * Returns to a callback function the selected object
             *
             * @param id Object Id
             * @param c Callback function
             */
            get: function(id, c) {
                var itemId = id;
                var callback = c;
                this.getCollection(function(err, coll) {
                    try {
                        bsonId = new module.client.bson_serializer.ObjectID(itemId);
                        coll.findOne({ _id : bsonId }, function(err, doc) {
                            module.client.close();
                            callback(err, doc);
                        });
                    } catch(err) {
                        callback(err, null);
                    }
                });
            },
            
            /**
             * Removes an object from the collection
             *
             * @param id Object Id
             * @param c Callback function
             */
            remove: function(id, c) {
                var itemId = id;
                var callback = c;
                this.getCollection(function(err, coll) {
                    try {
                        bsonId = new module.client.bson_serializer.ObjectID(itemId);
                        coll.remove({ _id : bsonId }, function(err, doc) {
                            module.client.close();
                            callback(err, doc);
                        });
                    } catch(err) {
                        callback(err, null);
                    }
                });
            },
            
            /**
             * Updates an object in the collection
             *
             * @param id Object Id
             * @param o New object
             * @param c Callback function
             */
            update: function(id, o, c) {
                var obj = o;
                var callback = c;
                var itemId = id;
                
                this.getCollection(function(err, coll) {
                    try {
                        bsonId = new module.client.bson_serializer.ObjectID(itemId);
                        coll.update({ _id: bsonId }, obj, { safe:true }, function(err) {
                            callback(err);
                        });
                    } catch(err) {
                        callback(err, null);
                    }
                });
            },
            
            /**
             * Returns a list of object
             *
             * @param f Fields to return
             * @param c Callback function
             */
            list: function(w, f, c) {
                var where = w;
                var fields = f;
                var callback = c;
                this.getCollection(function(err, coll) {
                    try {
                        mongoFields = {};
                        for (var i=0; i < fields.length; i++) {
                            mongoFields[fields[i]] = 1;
                        }
                        coll.find(where, mongoFields).toArray(function(err, docs) {
                            module.client.close();
                            callback(err, docs);
                        });
                    } catch(err) {
                        callback(err, null);
                    }
                });
            }
        };
        
        return collectionObject;
    };

    return module;

}());

module.exports = mongo;