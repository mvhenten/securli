/* global Blob */

"use strict";

const DRIVE_URL = "https://www.googleapis.com/drive/v3/files";


var store = require("./store/download");
var auth    = require("./store/auth");
var decrypt = require("./crypt").decrypt;
var mime = require('mime-types');

function blobToArray(blob, done) {
    var reader = new FileReader();

    reader.onload = function(evt) {
        return done(null, new Uint8Array(evt.target.result));
    };

    reader.readAsArrayBuffer(blob);
}


function getMetaData(id, done) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", DRIVE_URL + "/" + id + "?fields=id%2CmimeType%2Cname%2Csize", true);
    xhr.setRequestHeader("Authorization", "Bearer " + auth.state.accessToken);

    xhr.onload = function(evt) {
        var data = JSON.parse(xhr.response);

        data.name = data.name.replace(/[.]pgp$/, "");
        data.mimeType = mime.lookup(data.name);

        done(null, data);
    };

    xhr.send(null);

}

function download(id, meta, done) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", DRIVE_URL + "/" + id + "?alt=media", true);

    xhr.responseType = "blob";
    xhr.setRequestHeader("Authorization", "Bearer " + auth.state.accessToken);
    

    xhr.onprogress = function(evt) {
        var progress = Math.round(evt.loaded/meta.size * 100);

        store.setState({
            status: progress + "% downloading " + meta.name,
            progress: progress * 0.9,
            active: true,
            done: false
        });
    };

    xhr.onload = function(evt) {
        var buf = xhr.response;

        blobToArray(buf, function(nil, data) {
            store.setState("status", "Decrypting " + meta.name);

            decrypt(data, function(nil, data) {
                var blob = new Blob([data], {
                    type: meta.mimeType
                });
                
                store.setState({
                    active: false,
                    done: true,
                    file: {
                        size: meta.size,
                        name: meta.name,
                        type: meta.mimeType,
                        id: id,
                        url: window.URL.createObjectURL(blob)
                    }
                });
            });
        });
    };

    xhr.send(null);
}

function downloadFile(id, done) {
    store.replaceState({
        status: "Preparing download",
        progress: 0,
        active: true
    });

    getMetaData(id, function(nil, meta) {
        download(id, meta, done);
    });
}


module.exports.getFile = downloadFile;