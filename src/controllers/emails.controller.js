const nodemailer = require("nodemailer");
const { verifyToken } = require("../utils/jwt");
const { Op } = require("sequelize");
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
    return res.status(400).json(400, { message: error.message });
  }
};
const sendMail = async (req, res) => {
  try {
    // ! Sử dụng gmail để gửi email
    // ! Người gửi cần cho phép "Imap" và "Quyền truy cập của ứng dụng kém an toàn"
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

    const email = { subject, emailContent, senderEmail, userId: sender.userId };
    const emailCreated = await db.Emails.create(email);
    for (let userId of arrUserId) {
      await db.UserHasEmail.create({
        userId,
        emailId: emailCreated.emailId,
      });
    }
    const message = {
      from: "phonebookaws@gmail.com",
      to: receiverString,
      subject,
      text: emailContent,
      attachments: attachments.map(async (path) => {
        path = path.replaceAll("https://", "");
        path = path.replaceAll("+", " ");
        const fileAttached = await db.AttachedFiles.findOne({
          where: {
            filePath: { [Op.like]: `%${path}%` },
            userId: sender.userId,
          },
          raw: true,
          nest: true,
        });
        if (fileAttached) {
          fileAttached.emailId = emailCreated.dataValues.emailId;
          await db.AttachedFiles.update(fileAttached, {
            where: {
              filePath: { [Op.like]: `%${path}%` },
              userId: sender.userId,
            },
          });
        }
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
    return res.status(400).json(400, { message: error.message });
  }
};
const getAllEmailReceive = async (req, res) => {
  try {
    let userToken;
    await verifyToken(req).then((data) => (userToken = data));
    const user = await db.Users.findOne({
      where: { email: userToken.email },
    });
    const emailsReceived = await db.UserHasEmail.findAll({
      where: {
        userId: user.userId,
      },
      attributes: ["emailId", "created_at"],
      include: [
        {
          model: db.Emails,
          as: "emails",
          attributes: ["subject", "emailContent"],
          include: [
            {
              model: db.Users,
              as: "users",
              attributes: [
                "userId",
                "name",
                "email",
                "address",
                "phone",
                "avatar",
              ],
            },
            {
              model: db.AttachedFiles,
              as: "attachedFiles",
              attributes: ["fileName", "filePath"],
            },
          ],
        },
      ],
      raw: true,
      nest: true,
    });
    let result = [];
    const setEmailId = new Set();
    for (let email of emailsReceived) {
      if (!setEmailId.has(email.emailId)) {
        setEmailId.add(email.emailId);
        result = [...result, email];
      } else {
        const attachments = await db.AttachedFiles.findAll({
          where: {
            emailId: email.emailId,
          },
          attributes: ["fileName", "filePath"],
        });
        const index = result.findIndex(
          (item) => item.emailId === email.emailId
        );
        result[index].emails.attachedFiles = attachments;
      }
    }
    return res.status(200).json(200, result);
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
const getAllEmailSent = async (req, res) => {
  try {
    let userToken;
    await verifyToken(req).then((data) => (userToken = data));
    const user = await db.Users.findOne({
      where: { email: userToken.email },
    });
    const emailsSent = await db.Emails.findAll({
      where: {
        userId: user.userId,
      },
      include: [
        {
          model: db.UserHasEmail,
          as: "userHasEmail",
          attributes: [],
          include: [
            {
              model: db.Users,
              as: "users",
              attributes: [
                "userId",
                "name",
                "email",
                "address",
                "phone",
                "avatar",
              ],
            },
          ],
        },
        {
          model: db.AttachedFiles,
          as: "attachedFiles",
          attributes: ["fileName", "filePath"],
        },
      ],
      raw: true,
      nest: true,
    });
    let result = [];
    const setEmailId = new Set();
    for (let email of emailsSent) {
      if (!setEmailId.has(email.emailId)) {
        setEmailId.add(email.emailId);
        result = [...result, email];
      } else {
        const attachments = await db.AttachedFiles.findAll({
          where: {
            emailId: email.emailId,
          },
          attributes: ["fileName", "filePath"],
        });
        const index = result.findIndex(
          (item) => item.emailId === email.emailId
        );
        result[index].attachedFiles = attachments;
      }
    }
    return res.status(200).json(200, result);
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
const search = async (req, res) => {
  try {
    let userToken;
    await verifyToken(req).then((data) => (userToken = data));
    const user = await db.Users.findOne({
      where: { email: userToken.email },
    });
    const { searchContent } = req.params;
    const emails = await db.Emails.findAll({
      where: {
        [Op.or]: [
          {
            subject: {
              [Op.like]: `%${searchContent}%`,
            },
          },
          {
            emailContent: {
              [Op.like]: `%${searchContent}%`,
            },
          },
        ],
      },
      include: [
        {
          model: db.Users,
          as: "users",
          attributes: ["name", "email", "address", "phone", "avatar"],
        },
        {
          model: db.UserHasEmail,
          as: "userHasEmail",
          attributes: [],
          include: [
            {
              model: db.Users,
              as: "users",
              attributes: ["name", "email", "address", "phone", "avatar"],
            },
          ],
        },
        {
          model: db.AttachedFiles,
          as: "attachedFiles",
          attributes: ["fileName", "filePath"],
        },
      ],
      raw: true,
      nest: true,
    });
    const setEmailId = new Set();
    let result = [];
    for (let email of emails) {
      if (!setEmailId.has(email.emailId)) {
        setEmailId.add(email.emailId);
        result = [...result, email];
      } else {
        const allUserHasEmail = await db.UserHasEmail.findAll({
          where: {
            emailId: email.emailId,
          },
          attributes: [],
          include: [
            {
              model: db.Users,
              as: "users",
              attributes: ["name", "email", "address", "phone", "avatar"],
            },
          ],
          raw: true,
          nest: true,
        });
        const attachments = await db.AttachedFiles.findAll({
          where: {
            emailId: email.emailId,
          },
          attributes: ["fileName", "filePath"],
          raw: true,
          nest: true,
        });
        const index = result.findIndex(
          (item) => item.emailId === email.emailId
        );
        result[index].attachedFiles = attachments;
        result[index].userHasEmail = allUserHasEmail;
      }
    }

    const searchByEmail = await db.Users.findAll({
      where: {
        [Op.and]: [
          {
            companyId: user.companyId,
          },
          {
            [Op.or]: [
              {
                email: {
                  [Op.like]: `%${searchContent}%`,
                },
              },
              {
                name: {
                  [Op.like]: `%${searchContent}%`,
                },
              },
              {
                phone: {
                  [Op.like]: `%${searchContent}%`,
                },
              },
            ],
          },
        ],
      },
      attributes: { exclude: ["password"] },
    });
    return res.status(200).json(200, { emails: result, users: searchByEmail });
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
module.exports = {
  sendMail,
  attachFile,
  getAllEmailReceive,
  getAllEmailSent,
  search,
};
