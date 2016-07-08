"use strict";

import { define } from "../store";

var keeper = require("../keeper");

var AuthStore = define("AuthStore", {
    expiresAt: Number,
    authenticated: Boolean,
    accessToken: String
});

module.exports = keeper.getStore(AuthStore);