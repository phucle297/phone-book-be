const express = require("express");
const rootRouter = express.Router();

rootRouter.use("/users", require("./users.routes"));
rootRouter.use("/companies", require("./companies.routes"));

module.exports = rootRouter;
