"use strict";

var CLIENT_ID = "733936170427-fttv6kehu5bpumvo6olg7bodvqivn2cn.apps.googleusercontent.com";
var SCOPES = ['https://www.googleapis.com/auth/drive'];

require("./drive");

var api = require("./api");
var store = require("../store/auth");

/**
* Check if current user has authorized this application.
*/
// window.checkGoogleAuth = function checkGoogleAuth(){
//   getGapi().auth.authorize({
//       'client_id': CLIENT_ID,
//       'scope': SCOPES.join(' '),
//       'immediate': true
//   }, handleAuthResult);
// }




/**
* Initiate auth flow in response to user clicking authorize button.
*
* @param {Event} event Button click event.
*/
module.exports.authorize = function handleAuthClick(event) {
  api().auth.authorize({
          client_id: CLIENT_ID,
          scope: SCOPES,
          immediate: false
      },
      function(result){
          if (result && !result.error) {
              window.googleAuthResult = result;
              
              console.log("authorized");

              store.setState("authenticated", true);
              store.setState("accessToken", result.access_token);
          }
      });

    return false;
};