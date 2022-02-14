const express = require("express");
const emailsRoutes = express.Router();
const emailController = require("../controllers/emails.controller");
const { authenticate, authorize } = require("../middleware/authentication");
emailsRoutes.post("/send-email", authenticate, emailController.sendMail);

module.exports = emailsRoutes;
