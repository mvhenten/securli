"use strict";

var CLIENT_ID = "733936170427-fttv6kehu5bpumvo6olg7bodvqivn2cn.apps.googleusercontent.com";
var SCOPES = ['https://www.googleapis.com/auth/drive'];

function getGapi(){
    return window.gapi;
}

var store = require("./store/auth");

/**
* Check if current user has authorized this application.
*/
window.checkGoogleAuth = function checkGoogleAuth(){
  getGapi().auth.authorize({
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
  }, handleAuthResult);
}


/**
* Handle response from authorization server.
*
* @param {Object} authResult Authorization result.
*/
function handleAuthResult(authResult) {
  console.log("authResult", authResult);
  
  window.googleAuthResult = authResult;
  
  if (authResult && !authResult.error) {
      store.setState("authenticated", true);
      loadDriveApi();
  }
}

/**
* Initiate auth flow in response to user clicking authorize button.
*
* @param {Event} event Button click event.
*/
module.exports.onClick = function handleAuthClick(event) {
  getGapi().auth.authorize({
          client_id: CLIENT_ID,
          scope: SCOPES,
          immediate: false
      },
      handleAuthResult);
  return false;
}

/**
* Load Drive API client library.
*/
function loadDriveApi() {
  getGapi().client.load('drive', 'v3', listFiles);
}

/**
* Print files.
*/
function listFiles() {
      var request = getGapi().client.drive.files.list({
            q: 'name contains "pgp"',
            'pageSize': 10,
            'fields': "nextPageToken, files(id, name)"
          });

  request.execute(function(resp) {
    console.log(resp.files);
      store.setState("files", resp.files);
    //   appendPre('Files:');
    //   var files = resp.items;
    //   if (files && files.length > 0) {
    //       for (var i = 0; i < files.length; i++) {
    //           var file = files[i];
    //           appendPre(file.title + ' (' + file.id + ')');
    //       }
    //   }
    //   else {
    //       appendPre('No files found.');
    //   }
  });
}