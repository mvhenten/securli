"use strict";

var agent = require("superagent");
var format = require("util").format;
var base64 = require('base64-js');
var auth    = require("../store/auth");
var uploads = require("../store/upload");

const CHUNK_SIZE = 5e6;
const DRIVE_URL = "https://www.googleapis.com/upload/drive/v3/files";

function initResume(location, next) {
    agent.put(location)
        .set({
            Authorization: "Bearer " + auth.state.accessToken,
            "Content-Range": "bytes */*",
        })
        .end(next);
}


function getChunk(res, headers, fileData) {
    var start = 0;
    var end = CHUNK_SIZE;

    if (res.headers["range"]) {
        var range = res.headers["range"].match(/bytes=(\d+)-(\d+)/);
        start = range[2];
        end = Math.min(fileData.byteLength, start + CHUNK_SIZE);
        headers["Content-Range"] = format("bytes %s-%s/%s", start, end - 1, fileData.byteLength);
    }

    uploads.setState({
        status: "Uploading file...",
        progress: 10 + (Math.round(start/fileData.byteLength*100))
    });

    return fileData.slice(start, end);
}

function upload(location, fileData, next) {
    initResume(location, function(x, res) {
        var headers = {
            Authorization: "Bearer " + auth.state.accessToken,
            "Content-Encoding": "base64"
        };

        var chunk = getChunk(res, headers, fileData);

        agent.put(location)
            .set(headers)
            .send(base64.fromByteArray(new Uint8Array(chunk)))
            .end(function(err, res) {
                if (res.statusCode == 308)
                    return upload(location, fileData, next);

                next(err, res);
            });
    });

}

module.exports.upload = function initUpload(metadata, data, done) {
    agent.post(DRIVE_URL)
        .set({
            Authorization: "Bearer " + auth.state.accessToken,
            "X-Upload-Content-Type": metadata.type,
            "X-Upload-Content-Length": data.byteLength
        })
        .query({
            uploadType: "resumable",
        })
        .send({
            name: metadata.name
        })
        .end(function(err, res) {
            if (err) return done(err);
            upload(res.headers["location"], data, done);
        });
};