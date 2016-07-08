"use strict";

var CLIENT_ID = "733936170427-fttv6kehu5bpumvo6olg7bodvqivn2cn.apps.googleusercontent.com";
var SCOPES = ['https://www.googleapis.com/auth/drive'];

require("./drive");

var api = require("./api");
var store = require("../store/auth");

var times = 0;

/**
 * Check if current user has authorized this application.
 */
function refresh(done) {
  if (!api() || !api().auth) {
    return setTimeout(function(){
      refresh(done);
    }, 100);
  }
  
  console.log(store.state.expiresAt < Date.now(), 'is expired?');
  
  console.log(store.state.expiresAt, Date.now());
  
  if (store.state.expiresAt && Date.now() < store.state.expiresAt) {
    console.log("no refresh");
    return callDone(done);
    
  }
  
  console.log("refrshing");
  
  // authorize(done);

  api().auth.authorize({
    client_id: CLIENT_ID,
    scope: SCOPES,
    immediate: true
  }, handleAuthResult(done));
}


/**
 * Initiate auth flow in response to user clicking authorize button.
 */
function authorize(done) {
  console.log("calling");
  api().auth.authorize({
      client_id: CLIENT_ID,
      scope: SCOPES,
      immediate: false
    },
    handleAuthResult(done));
}

function callDone(done) {
  if(done && typeof done == "function")
    done();
}


function handleAuthResult(done) {
  console.log("giving");
  return function(result) {
    console.log('authorized');
    if (result && !result.error) {
      console.log("resetting state");
      store.setState({
        authenticated: true,
        accessToken: result.access_token,
        expiresAt: result.expires_at * 1000
      });
      
      callDone(done);
      return;
    }

    store.setState({
      authenticated: false,
      accessToken: "",
      expiresAt: Date.now() - 1000
    });
  };
}

module.exports.refresh = refresh;

module.exports.authorize = authorize;