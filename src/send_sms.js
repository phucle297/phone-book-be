const twilio = require("twilio");
const config = require("./config");
const client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
client.messages
  .create({
    body: "This is the ship that made the Kessel Run in fourteen parsecs?",
    from: "+18455813514",
    to: "+84988256314",
  })
  .then((message) => console.log(message));
