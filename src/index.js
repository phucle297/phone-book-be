const express = require("express");
const cors = require("cors");
const rootRouter = require("./routes");
const reponseInterceptor = require("./middleware/interceptors");
const http = require("http");
const https = require("https");
const fs = require("fs");

const app = express();

app.use(express.json());

app.use(cors());
app.use(reponseInterceptor);

app.use("/api", rootRouter);
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Set up http and https
const httpServer = http.createServer(app);
const httpsServer = https.createServer(
  {
    ca: fs.readFileSync(`${__dirname}/ca_bundle.crt`),
    key: fs.readFileSync(`${__dirname}/private.key`),
    cert: fs.readFileSync(`${__dirname}/certificate.crt`),
  },
  app
);

httpServer.listen(80, () => {
  console.log("HTTP Server running on port 80");
});

httpsServer.listen(443, () => {
  console.log("HTTPS Server running on port 443");
});
