
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , util = require('util')
  , http = require('http')
  , Message = require('./models/message')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', function( req, res ){
  res.render('index', { title: 'Securli' });
});

app.post('/', function( req, res ){
    if ( req.body.message && req.body.email ) {
        util.log('creating new message for: ' + req.body.email );
        
        Message.create( req.body, function( err, data ){
            res.redirect( '/success/' + data.id );
            
            return;
        });
    }
    
    res.redirect( '/?error='  + ( req.body.message ? 'email' : 'message' ) );
});


app.get('/success/:id', function( req, res ){
  res.render('index', { title: 'Securli' });
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
