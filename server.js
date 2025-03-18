require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");

const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Attach io to app for use in controllers
app.set("io", io);

// Routes
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
