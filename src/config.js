var config = {
    server: {
        port: 8080
    },
    errors: {
        showStack: true,
        dumpExceptions: true
    },
    //auth: 'basicDatabase',
    data: {
        collectionsPrefix: "fw_",
        selectedRepository: 0,
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