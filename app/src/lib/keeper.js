"use strict";

var stores = {};
var states = {};

var Storage = {
    set: function(name, value) {
        window.localStorage.setItem(name, JSON.stringify(value));
    },
    
    get: function(name) {
        var val = window.localStorage.getItem(name);
        if (val) return JSON.parse(val);
    }
};

module.exports.getStore = function(Store) {
    var name = Store.storeName;
    
    if (!stores[name]) {
        var store = new Store();
        stores[name] = store;
        
        // store.observe(function(state){
        //     Storage.set(name, state);
        // });
    }
        
    return stores[name];
};

module.exports.restoreState = function() {
    for (var key in stores) {
        
    }
}