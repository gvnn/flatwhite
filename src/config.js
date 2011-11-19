var config = {
    server: {
        port: 8080
    },
    errors: {
        show_stack: true,
        dump_exceptions: true
    },
    //auth: 'basicDatabase',
    data: {
        collections_prefix: "fw_",
        selected_repository: 0,
        repositories: [
            {
                name: "mongo",
                db: "flatwhite",
                server: "127.0.0.1",
                port: 27017
            } //,...
        ]
    }
};

module.exports = config;