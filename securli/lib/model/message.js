/**
 * really simple abstraction over just reading and writing json files
 */

var Message,
    STORAGE_DIR,
    crypto = require('crypto'),
    path = require('path'),
    fs = require('fs'),
    util = require('util');

STORAGE_DIR = path.resolve(__dirname + '/../../storage');

function _md5_digest(data) {
    var hash = crypto.createHash('md5');

    hash.update(data);
    hash.update(Date.now() + '');

    return hash.digest('hex');
}

function _get_path(digest) {
    return util.format('%s/%s.json', STORAGE_DIR, digest);
}

Message = {
    create: function(data, fnReady) {
        var json = JSON.stringify(data),
            digest = _md5_digest(json);

        fs.writeFile(_get_path(digest), json, function(err) {
            if (err) {
                util.error(err);
            }
            fnReady(err, {
                id: digest
            });
        });
    },

    load: function(id, fnReady) {
        fs.readFile(_get_path(id), 'utf8', function(err, json) {
            var data = err ? null : JSON.parse(json);

            fnReady(err, data);
        });
    },

    delete: function(id, fnReady) {
        fs.unlink(_get_path(id), fnReady);
    }
};


module.exports = Message;
