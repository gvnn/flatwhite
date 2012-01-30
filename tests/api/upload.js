/* 
original script from http://www.anandprakash.net/2011/10/20/server-side-multipartform-data-uploads-from-nodejs/
*/
var Step = require('../external/step'),
        fs = require('fs'),
        Http = require('http');
var config = require("../../src/config");
 
function getFormDataForPost(fields, files) {
        function encodeFieldPart(boundary,name,value) {
                var return_part = "--" + boundary + "\r\n";
                return_part += "Content-Disposition: form-data; name=\"" + name + "\"\r\n\r\n";
                return_part += value + "\r\n";
                return return_part;
    }
    function encodeFilePart(boundary,type,name,filename) {
        var return_part = "--" + boundary + "\r\n";
        return_part += "Content-Disposition: form-data; name=\"" + name + "\"; filename=\"" + filename + "\"\r\n";
        return_part += "Content-Type: " + type + "\r\n\r\n";
        return return_part;
    }
    var boundary = Math.random();
    var post_data = [];
 
    if (fields) {
        for (var key in fields) {
            var value = fields[key];
            post_data.push(new Buffer(encodeFieldPart(boundary, key, value), 'ascii'));
        }
    }
    if (files) {
        for (var key in files) {
            var value = files[key];
            post_data.push(new Buffer(encodeFilePart(boundary, value.type, value.keyname, value.valuename), 'ascii'));
 
            post_data.push(new Buffer(value.data, 'utf8'))
        }
    }
    post_data.push(new Buffer("\r\n--" + boundary + "--"), 'ascii');
    var length = 0;
 
    for(var i = 0; i < post_data.length; i++) {
        length += post_data[i].length;
    }
    var params = {
        postdata : post_data,
        headers : {
            'Content-Type': 'multipart/form-data; boundary=' + boundary,
            'Content-Length': length
        }
    };
    return params;
}

function postData(fields, files, options, headers, callback) {
    var headerparams = getFormDataForPost(fields, files);
    var totalheaders = headerparams.headers;
    for (var key in headers) totalheaders[key] = headers[key];
 
    var post_options = {
        host: options.host,
        port: options.port,
        path: options.path,
        method: options.method || 'POST',
        headers: totalheaders
    };
    var request = Http.request(post_options, function(response) {
        response.body = '';
        response.setEncoding(options.encoding);
        response.on('data', function(chunk){
            //console.log(chunk);
            response.body += chunk;
        });
        response.on('end', function() {
            callback(null, response)
        });
    });
 
    for (var i = 0; i < headerparams.postdata.length; i++) {
        request.write(headerparams.postdata[i]);
    }
    request.end();
}
 
function postImage(options, filename, headers, callback) {
    Step(
        function readImage()
        {
            fs.readFile(filename, this);
        },
        function(err, filecontents) {
            if (err) {
                Console.log('Unable to read file');
                return;
            }
            postData(null, [{type: 'image/png', keyname: 'coffee.png', valuename: 'coffee.png', data: filecontents}], options, headers, this);
        },
        function(err, response) {
            //console.log("response code " + response.statusCode);
            callback(response);
        }
    );
}
 
//===== PUBLIC ================================================================
 
var interface = {
    getFormDataForPost : getFormDataForPost,
    postData : postData,
    postImage : postImage
};
 
module.exports = interface;
 
//======= USAGE ============================================================
/*
var options = {
    host : config.server.ip,
    port : config.server.port,
    path : '/1/files',
    method : 'POST',
    encoding : 'utf8'
};
*/
//postImage(options, "../images/coffee.png", {});