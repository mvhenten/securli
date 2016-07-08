"use strict";

/* global Blob */

var DriveUpload = require("./google/upload");
var encryptChunk = require("./crypt").encryptChunk;
var uploads = require("./store/upload");
var drive = require("./google/drive");

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
        active: true,
        progress: 0
    });

    reader.onload = function(evt) {
        uploads.setState({
            status: "Encrypting file...",
            progress: 10
        });

        encryptChunk(evt.target.result, function(nil, crypted){
            bufferToFile(crypted, function(nil, data){
                var cryptedMetadata = {
                    type: "application/pgp",
                    name: metadata.name + ".pgp"
                };

                DriveUpload.upload(cryptedMetadata, data, function(err, res){
                    if (err) console.error("Got err: ", err);
                    
                    console.log("done, upload complete", uploads.state.toPlainObject());
                    uploads.setState({
                        active: false,
                        done: true
                    });
                    
                    drive.listFiles();

                });
            });
        });
    };

    reader.readAsArrayBuffer(file);
}

module.exports.readFile = readFile;