require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
var cookieParser = require('cookie-parser');
const getLoggedInUserDetails = require("./middleware/auth");
const userRouter = require("./routes/routeUser");
const empRouter = require("./routes/routeEmp");
const taskRouter = require("./routes/routeTask");
const leaveRouter = require("./routes/routeLeave");

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  //// Use extended: true to allow parsing of complex objects and nested data from URL-encoded requests.
app.use(cookieParser()); 

// Security Routes
app.use("/api/v1/user/admin", userRouter);
app.use("/api/v1/user/auth", userRouter);

// routes
app.use(getLoggedInUserDetails);
app.use("/api/v1/emp/admin", empRouter);
app.use("/api/v1/emp", empRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter);
app.use("/api/v1/leaves/admin",leaveRouter);
app.use("/api/v1/leaves",leaveRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});


module.exports = app;