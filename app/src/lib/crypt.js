"use strict";

var pgp = require("openpgp");


pgp.initWorker({ path:'./worker/openpgp.worker.js' });

function encryptChunk(data, next) {
    var options = {
        data: new Uint8Array(data),               // input as Uint8Array (or String)
        passwords: ['secret stuff'],              // multiple passwords possible
        armor: false                              // don't ASCII armor (for Uint8Array output)
    };

    pgp.encrypt(options).then(function(ciphertext) {
        var encrypted = ciphertext.message.packets.write(); // get raw encrypted packets as Uint8Array
        next(null, encrypted);
    });
}

function decrypt(data, next) {
    var options = {
        message: pgp.message.read(data), // parse encrypted bytes
        password: 'secret stuff',                 // decrypt with password
        format: 'binary'                          // output as Uint8Array
    };
    
    pgp.decrypt(options).then(function(plaintext) {
        next(null, plaintext.data); // Uint8Array([0x01, 0x01, 0x01])
    });    
}


module.exports.encryptChunk = encryptChunk;
module.exports.decrypt = decrypt;

