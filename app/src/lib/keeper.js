"use strict";

var stores = {};
var states = {};

var Storage = {
    set: function(name, value) {
        window.sessionStorage.setItem(name, JSON.stringify(value));
    },
    
    get: function(name) {
        var val = window.sessionStorage.getItem(name);
        if (val) return JSON.parse(val);
    }
};

module.exports.getStore = function(Store) {
    var name = Store.storeName;
    
    if (!stores[name]) {
        var store = new Store();
        stores[name] = store;
        
        store.observe(function(state){
            Storage.set(name, state);
        });
    }
        
    return stores[name];
};

module.exports.restoreState = function() {
    console.log("restoring state");
    for (let name in stores) {
        let state = Storage.get(name);
        if(state) stores[name].setState(state);
    }
};