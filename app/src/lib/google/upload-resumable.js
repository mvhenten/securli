"use strict";

var async = require("async");
var api = require("./google/api");
var agent = require("superagent");
var format = require("util").format;
var base64 = require('base64-js')

const CHUNK_SIZE = 5e6;


function calculateChunks(file) {
    var start = 0;
    var end = CHUNK_SIZE;
    var chunks = [];

    do {
        chunks.push({
            start: start,
            end: Math.min(file.byteLength, end)
        });

        start = end;
        end = end + CHUNK_SIZE;
    }
    while (start < file.byteLength);

    return chunks;
}

function upload(fileData, location, chunk, next) {
    initResume(location, function(x, res) {
        var headers = {
            Authorization: "Bearer " + window.googleAuthResult.access_token,
            "Content-Encoding": "base64"
        };
        
        var start = 0;
        var end   = CHUNK_SIZE;
        
        if (res.headers["range"]) {
            var range = res.headers["range"].match(/bytes=(\d+)-(\d+)/);
            start = range[2];
            end   = Math.min(fileData.byteLength, start + CHUNK_SIZE);
            
            console.log("start, end", start, end);

            headers["Content-Range"] = format("bytes %s-%s/%s", start, end-1, fileData.byteLength);
            console.log(headers["Content-Range"]);
        }

        var chunkData = fileData.slice(start, end);
        console.log("Total bytes: ", chunkData.byteLength);



        agent.put(location)
            .set(headers)
            .send(base64.fromByteArray(new Uint8Array(chunkData)))
            .end(function(err, res) {
                if (res.statusCode == 308) return next();
                console.log("GOT RES: ", res);
                if (err) return next(err);
                next("oerr");
            });
    });

}

var DRIVE_URL = "https://www.googleapis.com/upload/drive/v3/files";


function initUpload(file, done) {
    console.log(window.googleAuthResult);

    agent.post(DRIVE_URL)
        .set({
            Authorization: "Bearer " + window.googleAuthResult.access_token,
            "X-Upload-Content-Type": file.type,
            "X-Upload-Content-Length": file.size
        })
        .query({
            uploadType: "resumable",
        })
        .end(function(err, res) {
            if (err) return done(err);
            var location = res.headers["location"];
            done(err, location);
        });
}

function initResume(location, next) {
    agent.put(location)
        .set({
            Authorization: "Bearer " + window.googleAuthResult.access_token,
            "Content-Range": "bytes */*",
        })
        .end(next);
}



function readFile(file) {
    var reader = new FileReader();

    reader.onload = function(evt) {
        initUpload(file, function(err, location) {
            if (err) console.error("Got err: ", err);

            var fileData = evt.target.result;
            var chunks = calculateChunks(fileData);

            async.eachSeries(chunks, upload.bind(null, fileData, location), function(err) {
                if (err) console.error("Got err: ", err);
                console.log("done");
            });
        });
    };

    reader.readAsArrayBuffer(file);

}

module.exports.readFile = readFile;