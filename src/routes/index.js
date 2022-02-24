const express = require("express");
const rootRouter = express.Router();

rootRouter.use("/users", require("./users.routes"));
rootRouter.use("/companies", require("./companies.routes"));
rootRouter.use("/emails", require("./emails.routes"));
rootRouter.use("/sms", require("./sms.routes"));
module.exports = rootRouter;
