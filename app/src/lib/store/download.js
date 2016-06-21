"use strict";

import { define } from "../store";

var keeper = require("../keeper");

var DownloadStore = define("DownloadStore", {
    file: Object
});

module.exports = keeper.getStore(DownloadStore);
