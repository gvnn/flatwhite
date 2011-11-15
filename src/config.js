var config = {
    mongodb: {
        db: "flatwhite",
        host: "127.0.0.1",
        port: 27017
    },
    collections_prefix: "fw",
    server: {
        port: 8080
    },
    errors: {
        show_stack: true,
        dump_exceptions: true
    },
    auth: 'basicDatabase',
    data: {
        selected_repository: 0,
        repositories: [{
                name: "mongo",
                db: "test",
                server: "127.0.0.1",
                port: 27017
            }, {
                name: "redis",
                server: "127.0.0.1",
                port: 6379
            }
        ]
    }
};

module.exports = config;