"use strict";

import { define } from "../store";

var keeper = require("../keeper");

var Upload = define("AuthStore", {
    status: String,
    name: String,
    progress: Number,
    done: Boolean,
    file: Object,
});

module.exports = keeper.getStore(Upload);