require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const PORT = process.env.PORT || 5500;
const router = require("./routes");
const DbConnect = require("./database");
const ACTIONS = require("./actions");
app.use(cookieParser());
const corsOptions = {
  credentials: true,
  origin: ["http://localhost:3000"],
};

app.use(cors(corsOptions));
DbConnect();
app.use(express.json({ limit: "8mb" }));
//all api from router routes registerd here
app.use(router);

app.get("/", (req, res) => {
  res.status(200).send("helllo");
});

// app.listen(PORT, () => {
//   console.log(`app is listining on ${PORT}`);
// });

//sockets
const socketUserMapping = {};
io.on("connection", (socket) => {
  console.log("socket details", socket.id);
  //on ka matlab hum event ko listen krte hai
  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    socketUserMapping[socket.id] = user;
    //io.sockets.adapter.room    --->so this basically a map
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    console.log(clients);
    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.ADD_PEER, {});
    });
    socket.emit(ACTIONS.ADD_PEER);
  });
});

server.listen(PORT, () => {
  console.log(`app is listining on ${PORT}`);
});
