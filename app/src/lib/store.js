"use strict";

function check(name, type, value) {
    if (/^(Boolean|Number|String|RegExp|Array|Object|Date|Function)$/.test(type.name)) {
        if (typeof value === type.name.toLowerCase()) return true;
        if ((value instanceof type)) return true;
        throw new TypeError("Expected " + name + " to be a " + type.name + ", got: " + typeof value);
    }
}

function shallowClone(value){
    if (Array.isArray(value))
        return Object.assign([], value.map(shallowClone));

    if (typeof value == "object") {
        return Object.assign({}, Object.keys(value).reduce(function(obj, key){
          obj[key] = shallowClone(value[key]);
          return obj;        
        }, {}));
    }

    return value;
}

function defineState(props) {
    var state = {};
    var vals = {};

    for (let key in props) {
        Object.defineProperty(state, key, {
            ennumerable: true,
            get: function() {
                return shallowClone(vals[key]);
            },

            set: function(val) {
                check(key, props[key], val);
                vals[key] = val;
            }
        });
    }
    
    state.toPlainObject = function(){
        return Object.keys(props).reduce((obj, key) => {
            obj[key] = state[key];
            return obj;            
        }, {});
    };

    return Object.freeze(state);
}


export default class Store {
    constructor(state) {
        var observers = [];
        
        this.state = defineState(this.attributes);

        this.observers = Object.freeze({
            add: function(fn) {
                check("observer.add", Function, fn);
                observers.push(fn);
            },
            remove: function(fn) {
                check("observer.remove", Function, fn);
                observers.splice(this.observers.indexOf(fn), 1);
            },

            call: function(state) {
                check("observer.call", Object, state);
                observers.forEach((fn) => fn.call(null, state));
            }
        });
        
        if (state) 
            this.setState(state);
    }
    
    get attributes() {
        throw new TypeError("You must implement attributes");
    }
    
    get storeName() {
        return this.constructor.name;
    }

    observe(fn) {
        this.observers.add(fn);
    }

    stopObserving(fn) {
        this.observers.remove(fn);
    }
    
    getState(name) {
        return this.state[name];
    }
    
    clearState() {
        this.state = defineState(this.attributes);
        this.observers.call(this.state.toPlainObject());
    }
    
    replaceState(state) {
        this.clearState();
        this.setState(state);
    }

    setState(name, state) {
        if (typeof name !== "string") {
            for(var key in name) 
                this.state[key] = name[key];            
        }
        else {
            this.state[name] = state;            
        }

        this.observers.call(this.state.toPlainObject());
    }
}

module.exports.create = function(props) {
    return new Store(props);
};


module.exports.define = function(name, props) {
    return class NamedStore extends Store {
        static get storeName() {
            return name;
        }

        get attributes() {
            return props;
        }
    };
};