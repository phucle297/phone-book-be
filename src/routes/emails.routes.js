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
emailsRoutes.get(
  "/get-all-emails-receive",
  authenticate,
  emailController.getAllEmailReceive
);
emailsRoutes.get(
  "/get-all-emails-sent",
  authenticate,
  emailController.getAllEmailSent
);
emailsRoutes.get("/search/:searchContent", authenticate, emailController.search);
module.exports = emailsRoutes;
