require("dotenv").config();

const DATABASE = process.env.DATABASE;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const HOST = process.env.HOST;
const DIALECT = process.env.DIALECT;
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const S3_SECRET_KEY = process.env.S3_SECRET_KEY;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_DOMAIN_NAME = process.env.S3_DOMAIN_NAME;
const RDS_HOSTNAME = process.env.RDS_HOSTNAME;
const RDS_PORT = process.env.RDS_PORT;
const RDS_DB_NAME = process.env.RDS_DB_NAME;
const RDS_USERNAME = process.env.RDS_USERNAME;
const RDS_PASSWORD = process.env.RDS_PASSWORD;
const SSH_TUNNEL_HOST = process.env.SSH_TUNNEL_HOST;
const SSH_TUNNEL_PORT = process.env.SSH_TUNNEL_PORT;
const SSH_TUNNEL_USERNAME = process.env.SSH_TUNNEL_USERNAME;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const NEXMO_API_KEY = process.env.NEXMO_API_KEY;
const NEXMO_API_SECRET = process.env.NEXMO_API_SECRET;
module.exports = {
  DATABASE,
  USERNAME,
  PASSWORD,
  HOST,
  DIALECT,
  PORT,
  SECRET_KEY,
  S3_ACCESS_KEY_ID,
  S3_SECRET_KEY,
  S3_BUCKET_NAME,
  S3_DOMAIN_NAME,
  RDS_HOSTNAME,
  RDS_PORT,
  RDS_DB_NAME,
  RDS_USERNAME,
  RDS_PASSWORD,
  SSH_TUNNEL_HOST,
  SSH_TUNNEL_PORT,
  SSH_TUNNEL_USERNAME,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  NEXMO_API_KEY,
  NEXMO_API_SECRET,
};
