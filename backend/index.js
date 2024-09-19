require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes/routeUser");

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/user" , router);

module.exports = app;