const express = require("express");
const smsRoutes = express.Router();
const smsController = require("../controllers/sms.controller");
const { authenticate, authorize } = require("../middleware/authentication");

smsRoutes.post("/send-sms", authenticate, smsController.sendSms);
smsRoutes.get("/get-all-sms-sent", authenticate, smsController.getAllSmsSent);
smsRoutes.get(
  "/get-all-sms-receive",
  authenticate,
  smsController.getAllSmsReceive
);
smsRoutes.get("/search/:searchContent", authenticate, smsController.search);

module.exports = smsRoutes;
