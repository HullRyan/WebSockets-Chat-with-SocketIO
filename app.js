//Ryan Hull
//Socket.io Starting App

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const userList = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//User connect/disconnect 
io.on("connection", (socket) => {
  let username = '';
  socket.on("join", (user) => {
    username = user;
    userList.push(user);
    io.emit("userList updated", userList);
    console.log("User connected");
  });
  socket.on("disconnect", (user) => {
    try {
      userList.splice(userList.indexOf(user), 1);
    } catch (err) {
      console.log(err);
    }
    io.emit("userList updated", userList);
    console.log("User disconnected");
  });
  socket.on("rejoin", (user) => {
    try {
      userList.splice(userList.indexOf(username), 1);
    } catch (err) {
      console.log(err);
    }
    username = user;
    userList.push(user);
    io.emit("userList updated", userList);
    console.log("User reconnected");
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(3009, () => {
  console.log("listening on *:3009");
});
