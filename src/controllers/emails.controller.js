const nodemailer = require("nodemailer");
const { verifyToken } = require("../utils/jwt");
const db = require("../models");
const sendMail = async (req, res) => {
  try {
    // ! Sử dụng gmail để gửi email
    // ! Cần cho phép "Imap" và "Quyền truy cập của ứng dụng kém an toàn"
    // ! Chỉ người nhận nào có trong db mới có thể nhận email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "phucle.2971.dd@gmail.com",
        pass: "ws50x_SJ@",
      },
    });
    let arrUserId = [];
    const { subject, emailContent, receivers } = req.body;
    for (let email of receivers) {
      const user = await db.Users.findOne({ where: { email } });
      if (!user) receivers.splice(receivers.indexOf(email), 1);
      else arrUserId = [...arrUserId, user.userId];
    }
    const receiverString = receivers.toString();

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
    const mailOptions = {
      //   from: senderEmail,
      from: "phucle.2971.dd@gmail.com",
      to: receiverString,
      subject,
      text: emailContent,
    };

    transporter.sendMail(mailOptions, (err, info) => {
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

module.exports = { sendMail };
