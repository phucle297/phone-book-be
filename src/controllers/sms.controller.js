const config = require("../config");
const db = require("../models");
const { verifyToken } = require("../utils/jwt");
const { Op } = require("sequelize");
const sendSms = async (req, res) => {
  // ! Type of number is E.164 (example: +12065550100,+84905123123)
  const { content, receivers } = req.body;
  const accountSid = config.TWILIO_ACCOUNT_SID;
  const authToken = config.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);
  let arrNumErr = [];
  let arrNumSuccess = [];

  let senderSms;
  await verifyToken(req).then((data) => (senderSms = data.email));
  let sender = await db.Users.findOne({ where: { email: senderSms } });
  for (receiver of receivers) {
    await client.messages
      .create({
        body: content,
        from: config.TWILIO_PHONE_NUMBER,
        to: receiver,
      })
      .then(async (message) => {
        arrNumSuccess.push(receiver);
        const sms = await db.Sms.create(
          {
            smsContent: content,
            userId: sender.userId,
          },
          {
            option: { raw: true },
          }
        );
        const numberFormarted = receiver.replace(" ", "");
        const user = await db.Users.findOne({
          where: { phone: numberFormarted },
        });
        await db.UserHasSms.create({
          userId: user.userId,
          smsId: sms.smsId,
        });
      })
      .catch((err) => {});
  }
  arrNumErr = receivers.filter((receiver) => !arrNumSuccess.includes(receiver));
  if (arrNumSuccess.length < 1)
    return res.status(400).json(400, "SMS can not be sent");
  return res
    .status(201)
    .json(201, { message: "SMS has been sent", arrNumSuccess, arrNumErr });
};

const getAllSmsSent = async (req, res) => {
  try {
    let emailAccountToken;
    await verifyToken(req).then((data) => (emailAccountToken = data.email));
    let user = await db.Users.findOne({ where: { email: emailAccountToken } });

    const sms = await db.Sms.findAll({
      where: { userId: user.userId },
      include: [
        {
          model: db.Users,
          as: "users",
          attributes: ["userId", "name", "email", "address", "phone"],
        },
      ],

      raw: true,
    });
    return res.status(200).json(200, sms);
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
const getAllSmsReceive = async (req, res) => {
  try {
    let emailAccountToken;
    await verifyToken(req).then((data) => (emailAccountToken = data.email));
    let user = await db.Users.findOne({ where: { email: emailAccountToken } });

    const smsReceived = await db.UserHasSms.findAll({
      where: { userId: user.userId },
      include: [
        {
          model: db.Sms,
          as: "sms",
          attributes: ["smsId", "smsContent"],
        },
        {
          model: db.Users,
          as: "users",
          attributes: ["userId", "name", "email", "address", "phone"],
        },
      ],
      raw: true,
    });
    return res.status(200).json(200, smsReceived);
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
const search = async (req, res) => {
  try {
    let emailAccountToken;
    await verifyToken(req).then((data) => (emailAccountToken = data.email));
    let user = await db.Users.findOne({ where: { email: emailAccountToken } });
    const { searchContent } = req.params;
    const sms = await db.Sms.findAll({
      where: {
        smsContent: {
          [Op.like]: `%${searchContent}%`,
        },
      },
    });
    const users = await db.Users.findAll({
      where: {
        [Op.and]: [
          {
            companyId: user.companyId,
          },
          {
            [Op.or]: [
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
    return res.status(200).json(200, { sms, users });
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
module.exports = { sendSms, getAllSmsSent, search, getAllSmsReceive };
