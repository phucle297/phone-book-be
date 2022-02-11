const express = require("express");
const rootRouter = express.Router();

rootRouter.use("/users", require("./users.routes"));

module.exports = rootRouter;
