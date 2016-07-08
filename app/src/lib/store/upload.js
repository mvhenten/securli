"use strict";

import { define } from "../store";

var keeper = require("../keeper");

var Upload = define("Upload", {
    status: String,
    name: String,
    progress: Number,
    active: Boolean,
    done: Boolean,
    file: Object,
});

module.exports = keeper.getStore(Upload);