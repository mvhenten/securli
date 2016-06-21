"use strict";

var api = require("./api");

var auth = require("../store/auth");
var uploads = require("../store/upload");
var files = require("../store/files");

auth.observe(function(){
    api().client.load('drive', 'v3', listFiles);

    uploads.observe(function(state){
        if (state.done) listFiles();
    });    
});



function listFiles() {
    var request = api().client.drive.files.list({
        q: 'name contains "pgp"',
        'pageSize': 10,
        'fields': "nextPageToken, files(id, name)"
    });

    request.execute(function(resp) {
        files.setState("files", resp.files);
    });
}

module.exports.listFiles = listFiles;
