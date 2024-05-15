"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./src/app");
var config_1 = require("./src/config/config");
var db_1 = require("./src/config/db");
var PORT = config_1.config.port || 5500;
// const PORT = 8081;
(0, db_1.default)();
app_1.default.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
