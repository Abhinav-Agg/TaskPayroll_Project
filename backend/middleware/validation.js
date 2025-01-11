const asyncHandler = require("../utils/AsyncHandlerWrapper");
const db = require("../db/dbModel");
const { where, Op } = require("sequelize");
const ApiError = require("../utils/ApiError");

const employeeValidation = asyncHandler(async (req, res, next) => {
    // Userlogin will be Email/Empnumber. 
    let { fullName, empNumber, email, address, userLogin, userPassword, empDepartment, empDesignation, empRole } = req.body;

    let reqsVal = [fullName, empNumber, email, address, userLogin, userPassword, empDepartment, empDesignation, empRole].some(value => value === "");

    if (reqsVal) throw new ApiError(404, "field empty");

    let existingEmp = await db.Employee.findOne({
        where:
        {
            [Op.or]:
                [
                    { Email: email }, { Empnumber: empNumber }
                ]
        }
    });

    if (existingEmp) throw new ApiError(202, "Employee already exists");

    next();
});

const LeaveValidation = (req, res, next) => {

}

module.exports = {employeeValidation, LeaveValidation};