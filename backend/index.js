require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes/routeUser");
const empRouter = require("./routes/routeEmp");

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/user" , router);
app.use("/api/v1/employee" , empRouter);

module.exports = app;