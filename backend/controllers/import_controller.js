const db = require("../db/dbModel");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandlerWrapper");
const { createUser, createUserRole } = require("./user_controller");
const ApiResponse = require("../utils/ApiResponse");
const { where, Op } = require("sequelize");
const { checkMiddlewareCurrentUser, validateEmpwithEmpNumber } = require("../utils/CommonMethod");

// API -> In this we will add bulk employees
const addBulkEmployee = asyncHandler(async(req, res) => {
    res.send(req.file);
});

module.exports = {addBulkEmployee};