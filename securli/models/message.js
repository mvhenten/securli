var Message,
    STORAGE_DIR,
    crypto = require('crypto'),
    path    = require('path'),
    fs      = require('fs'),
    util    = require('util');
    
STORAGE_DIR = path.resolve( __dirname + '/../storage' );

function _md5_digest ( data ) {
    var hash = crypto.createHash('md5');
    
    hash.update( data );
//      hash.update( Date.now() + '' );
    
    return hash.digest('hex');
}    


Message = {
    create: function( data, fnReady ){
        var json = JSON.stringify( data ),
            digest = _md5_digest( json ),
            path = util.format('%s/%s.json', STORAGE_DIR, digest );
    
        fs.writeFile( path, json, function(err){
            if ( err) {
                util.error( err );
            }
            fnReady( err, { id: digest } );
        });
    },
    
    load: function( id, fnReady ){
        var path = util.format( '%s/%s.json', STORAGE_DIR, id );
        
        fs.readFile( path, 'utf8', function( err, json ){
            if ( ! err ) {
                var data = JSON.parse(json);
                fnReady( null, data );
                return;
            }
            
            fnReady( err, null );
        });
    }    
};


module.exports = Message;