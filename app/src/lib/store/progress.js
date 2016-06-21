"use strict";

import { define } from "../store";

var keeper = require("../keeper");

var Progress = define("Progress", {
    upload: Object,
    download: Object,
});

module.exports = keeper.getStore(Progress);
