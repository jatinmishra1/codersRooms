require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5500;
const router = require("./routes");
const DbConnect = require("./database");

const corsOptions = {
  origin: ["http://localhost:3000"],
};

app.use(cors(corsOptions));
DbConnect();
app.use(express.json());
//all api from router routes registerd here
app.use(router);

app.get("/", (req, res) => {
  res.status(200).send("helllo");
});

app.listen(PORT, () => {
  console.log(`app is listining on ${PORT}`);
});
