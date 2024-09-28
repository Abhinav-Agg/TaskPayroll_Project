require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const userRouter = require("./routes/routeUser");
const empRouter = require("./routes/routeEmp");
var cookieParser = require('cookie-parser')
const getLoggedInUserDetails = require("./middleware/auth");

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Security Routes
app.use("/api/v1/admin", userRouter);
app.use("/api/v1/user", userRouter);

// routes
app.use(getLoggedInUserDetails);
app.use("/api/v1/employee", empRouter);
app.use("/api/v1/getuser", userRouter);


module.exports = app;