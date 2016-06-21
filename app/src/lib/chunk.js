"use strict";

var async = require("async");

const CHUNK_SIZE = 5e5;

function calculateChunks(fileData, metadata) {
    var start = 0;
    var end = CHUNK_SIZE;
    var chunks = [];
    var chunk = 0;

    do {
        chunks.push({
            chunk: chunk,
            metadata: metadata,
            start: start,
            end: Math.min(fileData.byteLength, end)
        });

        chunk++;
        start = end;
        end = end + CHUNK_SIZE;
    }
    while (start < fileData.byteLength);

    return chunks;
}

function Chunks(fileData, metadata) {
    this._fileData = fileData;
    this._metadata = metadata;
}

Chunks.prototype._getChunks = function() {
    if (!this._chunks)
        this._chunks = calculateChunks(this._fileData, this._metadata);
    
    return this._chunks;
};

Chunks.prototype.eachChunk = function(fn, done) {
    var self = this;
    
    async.mapSeries(this._getChunks(), function(chunk, next){
        fn(self._fileData.slice(chunk.start, chunk.end), next);
    }, done);
};

module.exports = Chunks;

