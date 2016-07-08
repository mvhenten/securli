"use strict";

import { define } from "../store";

var keeper = require("../keeper");

var DownloadStore = define("DownloadStore", {
    file: Object,
    status: String,
    name: String,
    progress: Number,
    active: Boolean,
    done: Boolean,
});

module.exports = keeper.getStore(DownloadStore);
