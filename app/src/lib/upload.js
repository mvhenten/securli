"use strict";

/* global Blob */

var DriveUpload = require("./google/upload");
var encryptChunk = require("./crypt").encryptChunk;
var uploads = require("./store/upload");

function bufferToFile(buf, done){
    var data = new Blob([buf]);
    var blobReader = new FileReader();
    
    blobReader.onload = function(evt) {
        done(null, evt.target.result);
    };
    
    blobReader.readAsArrayBuffer(data);
}

function readFile(file) {
    var reader = new FileReader();
    
    var metadata = {
      type: file.type,
      name: file.name
    };
    
    uploads.setState({
        name: file.name,
        status: "Reading file...",
        done: false,
        progress: 0
    });

    reader.onload = function(evt) {
        encryptChunk(evt.target.result, function(nil, crypted){
            bufferToFile(crypted, function(nil, data){
                var cryptedMetadata = {
                    type: "application/pgp",
                    name: metadata.name + ".pgp"
                };

                DriveUpload.upload(cryptedMetadata, data, function(err, res){
                    if (err) console.error("Got err: ", err);
                    uploads.setState("done", true);
                });
            });
        });
    };

    reader.readAsArrayBuffer(file);
}

module.exports.readFile = readFile;