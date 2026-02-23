const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let OnlineUsers=[];
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  // if(!OnlineUsers.length>2){
  //   OnlineUsers=[];
  //   // socket
  // io.emit("OnlineUsers",{OnlineUsers:OnlineUsers})

  // }
  if(!OnlineUsers.includes(socket.id)){
    OnlineUsers.push(socket.id);
  }

  io.emit("OnlineUsers",{OnlineUsers:OnlineUsers})

  
  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    socket.to(roomId).emit("user-joined");

    socket.on("offer", (offer) => {
      socket.to(roomId).emit("offer", offer);
    });

    socket.on("answer", (answer) => {
      socket.to(roomId).emit("answer", answer);
    });

    socket.on("ice-candidate", (candidate) => {
      socket.to(roomId).emit("ice-candidate", candidate);
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected",socket.id);
    // console.log("User disconnected",id);

   OnlineUsers = OnlineUsers.filter((id) => id != socket.id);
    io.emit("OnlineUsers",{OnlineUsers:OnlineUsers})
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
