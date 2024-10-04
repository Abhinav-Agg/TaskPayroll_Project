require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
var cookieParser = require('cookie-parser')
const getLoggedInUserDetails = require("./middleware/auth");
const userRouter = require("./routes/routeUser");
const empRouter = require("./routes/routeEmp");
const taskRouter = require("./routes/routeTask");

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Security Routes
app.use("/api/v1/user/admin", userRouter);
app.use("/api/v1/auth/user", userRouter);

// routes
app.use(getLoggedInUserDetails);
app.use("/api/v1/emp/admin", empRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter);
app.use("/api/v1/emp", empRouter);


module.exports = app;