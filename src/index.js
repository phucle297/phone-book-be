const express = require("express");
const cors = require("cors");
const rootRouter = require("./routes");
const reponseInterceptor = require("./middleware/interceptors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(reponseInterceptor);
app.use("/api", rootRouter);
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.listen(8080, () => {
  console.log("This server is running on port 8080");
});
