"use strict";

var pgp = require("openpgp");
var async = require("async");

const CHUNK_SIZE = 5e5;

pgp.initWorker({ path:'./worker/openpgp.worker.js' });


function decrypt(encrypted, next) {
    var options = {
        message: pgp.message.read(encrypted), // parse encrypted bytes
        password: 'secret stuff',                 // decrypt with password
        format: 'binary'                          // output as Uint8Array
    };

    pgp.decrypt(options).then(function(decrypted) {
        next(null, decrypted.data);
    });    
}

function encrypt(data, next) {
    var options = {
        data: new Uint8Array(data), // input as Uint8Array (or String)
        passwords: ['secret stuff'],              // multiple passwords possible
        armor: false                              // don't ASCII armor (for Uint8Array output)
    };

    pgp.encrypt(options).then(function(ciphertext) {
        var encrypted = ciphertext.message.packets.write(); // get raw encrypted packets as Uint8Array
        next(null, encrypted);
    });
}

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

function blobToArray(blob){
    var arrayBuffer;
    var fileReader = new FileReader();
    fileReader.onload = function() {
        arrayBuffer = this.result;
    };
    fileReader.readAsArrayBuffer(blob);    
}


module.exports = function() {
    
    var fileData;
    var observer;
    var crypted = [];
    

    
    function downloadFile() {
        var decrypted = [];
        var crypt = new Blob(crypted);

        var chunks = calculateChunks(crypt);
        
        console.log(chunks);

        
        function decryptChunk(data, next) {
            decrypt(data, function(nil, data){
                console.log("decrypted", data.length);
                decrypted.push(data);
                next();
            });
        }
        
        async.eachSeries(crypted, decryptChunk, function(err){
            console.log("got here");
            
            observer({ file: window.URL.createObjectURL(new Blob(decrypted, {type: "octet/stream"})) });
        });
    }
    
    function readFile(file){
        var reader = new FileReader();

        reader.onload = function(evt) {
            fileData = evt.target.result;
            var chunks = calculateChunks(fileData);
            
            function encryptChunk(chunk, next) {
                var data = fileData.slice(chunk.start, chunk.end);
                console.log("encrypting: ", data.byteLength);

                encrypt(data, function(nil, encrypted){
                    crypted.push(encrypted);
                    next();
                });
            }

            async.eachSeries(chunks, encryptChunk, function(err) {
                if (err) console.error("Got err: ", err);
                console.log("done");
                downloadFile();
            });

        };
        reader.readAsArrayBuffer(file);
    }
    
    
    return {
        observe: function(fn){
            observer = fn;
        },
        readFile: readFile,
        downloadFile: downloadFile
    };
};