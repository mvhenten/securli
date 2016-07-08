"use strict";

var auth = require("../store/auth");
var files = require("../store/files");
var agent = require("superagent");

var googleAuth = require("./auth");

const DRIVE_URL = "https://www.googleapis.com/drive/v3/files";


function requestFiles() {
    var query = 'mimeType contains "pgp"';
    
    if (files.state.query)
        query = `${query} and name contains "${files.state.query}"`;

    agent.get(DRIVE_URL)
        .set({
            Authorization: "Bearer " + auth.state.accessToken,
        })
        .query({
            q: query,
            pageSize: 25,
            fields: "nextPageToken, files(id, name)"
        })
        .end(function(err, res) {
            if (err) return console.error(err);
            files.setState({
                files: res.body.files,
                query: ""
            });
        });
    
}

function listFiles() {
    googleAuth.refresh(function(){
        requestFiles();        
    });
}

module.exports.listFiles = listFiles;
