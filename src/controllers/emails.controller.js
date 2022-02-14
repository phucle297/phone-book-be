const nodemailer = require("nodemailer");
const { verifyToken } = require("../utils/jwt");
const db = require("../models");
const config = require("../config");
const aws = require("aws-sdk");
const s3 = new aws.S3({
  accessKeyId: config.S3_ACCESS_KEY_ID,
  secretAccessKey: config.S3_SECRET_KEY,
});
const attachFile = async (req, res) => {
  try {
    const { buffer, originalname, mimetype } = req.file;
    const dst = `attachedFile/${Date.now()}_${originalname}`;
    const params = {
      Bucket: config.S3_BUCKET_NAME,
      Key: dst,
      Body: buffer,
      ContentType: mimetype,
    };
    s3.putObject(params, async (err, data) => {
      if (err) {
        return res
          .status(400)
          .json(400, { message: "Server error, couldn't upload" });
      } else {
        let url = `${config.S3_DOMAIN_NAME}/${dst}`;
        let userToken;
        await verifyToken(req).then((data) => (userToken = data));
        const user = await db.Users.findOne({
          where: { email: userToken.email },
        });
        const fileAttached = {
          fileName: originalname,
          filePath: url,
          userId: user.userId,
        };
        await db.AttachedFiles.create(fileAttached);
        url = "https://" + url.replaceAll(" ", "+");
        return res
          .status(201)
          .json(201, { message: "Attach file success!", url });
      }
    });
  } catch (error) {
    throw error;
  }
};
const sendMail = async (req, res) => {
  try {
    // ! Sử dụng gmail để gửi email
    // ! Cần cho phép "Imap" và "Quyền truy cập của ứng dụng kém an toàn"
    // ! Chỉ người nhận nào có trong db mới có thể nhận email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.GMAIL_USERNAME,
        pass: config.GMAIL_PASSWORD,
      },
    });
    let arrUserId = [];
    const { subject, emailContent, receivers, attachments } = req.body;

    let arrReceiver = [];
    for (let email of receivers) {
      const user = await db.Users.findOne({ where: { email } });
      if (user) {
        arrUserId = [...arrUserId, user.userId];
        arrReceiver = [...arrReceiver, email];
      }
    }

    const receiverString = arrReceiver.toString();

    let senderEmail;
    await verifyToken(req).then((data) => (senderEmail = data.email));

    let sender = await db.Users.findOne({ where: { email: senderEmail } });

    const email = { subject, emailContent, senderEmail, sender: sender.userId };
    const emailCreated = await db.Emails.create(email);
    for (let userId of arrUserId) {
      await db.UserHasEmail.create({
        userId,
        emailId: emailCreated.emailId,
      });
    }
    console.log(arrUserId);
    const message = {
      //   from: senderEmail,
      from: "phonebookaws@gmail.com",
      to: receiverString,
      subject,
      text: emailContent,
      attachments: attachments.map((path) => {
        return { path };
      }),
    };
    transporter.sendMail(message, (err, info) => {
      if (err) {
        return res.status(400).json(400, err);
      } else {
        return res.status(201).json(201, info);
      }
    });
  } catch (error) {
    throw error;
  }
};

module.exports = { sendMail, attachFile };
