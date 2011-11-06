//tests that mongodb is running properly
var mongodb = process.env['TEST_NATIVE'] != null ? require('mongodb').native() : require('mongodb').pure();
var Db = mongodb.Db, Server = mongodb.Server;
var unit_test, client;

var test_mongo_write = function (err, collection) {
    unit_test.expect(2);
    collection.insert({a:2}, function(err, docs) {
        collection.count(function(err, count) {
            unit_test.ok(count > 1);
        });
        collection.find().toArray(function(err, results) {
            unit_test.ok(results.length >= 1);
            unit_test.equal(results[results.length-1].a, 2);
            collection.remove({a:2}, function(err, removed) {
                collection.count(function(err, count) {
                    unit_test.ok(count == 0);
                    client.close();
                });
            });
        });
    });
};

exports.test_connection = function(test) {    
    unit_test = test;
    client = new Db('test', new Server("127.0.0.1", 27017, {}));
    test.expect(1);
    test.ok(client);
    test.done();
};

exports.test_write = function(test) {
    unit_test = test;
    client = new Db('test', new Server("127.0.0.1", 27017, {}));
    client.open(function(err, p_client) {
        client.collection('fw_test', test_mongo_write);
    });
    test.done();
}