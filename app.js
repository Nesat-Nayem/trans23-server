const express = require("express");
const app = express();
const port = process.env.PORT || 7070;
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const http = require("http").createServer(app);
const socketIO = require("socket.io")(http, {
  cors: {
    origin: ["http://localhost:3000", "http://dashboard.trans23.com", "http://franchises.trans23.com"], // use your actual domain name (or localhost), using * is not recommended

    credentials: true,
  },
});



const bodyParser = require("body-parser");

app.use(bodyParser.json());

// middlewares
app.use(express.json());
// app.use(cors());

app.use(cors());
app.use("/images", express.static("images"));


socketIO.on("connection", (socket) => {
  console.log("A user connected", socket.id);


});

socketIO.on('response', (data) => {
  console.log('Received response from client:', data);

  if (data.accepted) {
    // Handle the accepted case
  } else {
    // Handle the declined case
  }
});

socketIO.on("disconnect", () => {
  console.log("user disconnected");
});

socketIO.emit("myCustomEvent", { message: "Hello, React!" });

module.exports = {
  socketIO: socketIO,
};

app.use(cookieParser());

app.use(express.static("public"));

app.set("view engine", "ejs");

const connectDB = require("./config/db");
dotenv.config();

const allRouters = require("./routes/router");

const { errorHandler } = require("./middlewares/errorHandler");

// db connernt

connectDB();

app.use("/api", allRouters);

// default error handler

app.use(errorHandler);


app.get("/", (req, res) => {
  res.send("Trans23 server is running  ...");
});

http.listen(port, () => {
  console.log("listening port" + port);
});
