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
    }
};

module.exports = config;