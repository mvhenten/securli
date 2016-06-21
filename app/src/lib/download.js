/* global Blob */

"use strict";

const DRIVE_URL = "https://www.googleapis.com/drive/v3/files";


var store = require("./store/download");
var progress = require("./store/progress");
var decrypt = require("./crypt").decrypt;
var mime = require('mime-types')

function blobToArray(blob, done) {
    var reader = new FileReader();

    reader.onload = function(evt) {
        return done(null, new Uint8Array(evt.target.result));
    };

    reader.readAsArrayBuffer(blob);
}


function Uint8ArrayToBlob(uint8, type) {
    var dataView = new DataView(uint8.buffer);
    return new Blob([dataView], {
        type: type
    });
}

// https://www.googleapis.com/drive/v3/files/0B9jNhSvVjoIVM3dKcGRKRmVIOVU?alt=media
// https://www.googleapis.com/upload/drive/v3/files/0B7zHJEqqm40IbDhxbm5nVVYxRms?alt=media

function getMetaData(id, done) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", DRIVE_URL + "/" + id + "?fields=id%2CmimeType%2Cname%2Csize", true);

    xhr.setRequestHeader("Authorization", "Bearer " + window.googleAuthResult.access_token);


    xhr.onload = function(evt) {
        var data = JSON.parse(xhr.response);

        data.name = data.name.replace(/[.]pgp$/, "");
        data.mimeType = mime.lookup(data.name);

        console.log(data.size, 'le size');

        console.log(data, 'le data');

        done(null, data);
    }

    xhr.send(null);

}

function download(id, meta, done) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", DRIVE_URL + "/" + id + "?alt=media", true);

    xhr.responseType = "blob";
    xhr.setRequestHeader("Authorization", "Bearer " + window.googleAuthResult.access_token);
    

    xhr.onprogress = function(evt) {
        progress.setState("download", {
            name: meta.name,
            size: meta.size,
            loaded: evt.loaded,
            progress: Math.round(evt.loaded/meta.size * 100)
        });
    };

    xhr.onload = function(evt) {
        var buf = xhr.response;

        blobToArray(buf, function(nil, data) {
            progress.setState("download", { done: true });


            decrypt(data, function(nil, data) {
                var blob = new Blob([data], {
                    type: meta.mimeType
                });

                store.setState("file", {
                    name: meta.name,
                    type: meta.mimeType,
                    id: id,
                    url: window.URL.createObjectURL(blob)
                });
            });
        });
    };

    xhr.send(null);
}

function downloadFile(id, done) {
    getMetaData(id, function(nil, meta) {
        download(id, meta, done);
    });
}


module.exports.getFile = downloadFile;