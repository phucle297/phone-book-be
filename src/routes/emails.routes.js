const express = require("express");
const emailsRoutes = express.Router();
const emailController = require("../controllers/emails.controller");
const { authenticate, authorize } = require("../middleware/authentication");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
emailsRoutes.post("/send-email", authenticate, emailController.sendMail);
emailsRoutes.post(
  "/attach-file",
  upload.single("attachedFile"),
  authenticate,
  emailController.attachFile
);

module.exports = emailsRoutes;
