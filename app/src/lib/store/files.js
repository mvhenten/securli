"use strict";

import { define } from "../store";

var keeper = require("../keeper");

var Files = define("Files", {
    query: String,
    files: Array,
});

module.exports = keeper.getStore(Files);