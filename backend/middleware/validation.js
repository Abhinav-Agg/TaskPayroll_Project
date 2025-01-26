const asyncHandler = require("../utils/AsyncHandlerWrapper");
const db = require("../db/dbModel");
const { where, Op } = require("sequelize");
const ApiError = require("../utils/ApiError");
const { findEmpDetail } = require("../utils/CommonMethod");

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

const valdiateLeaves = asyncHandler(async(req, res, next) =>{

});
// const validateTimeentry = asyncHandler(async (req, res, next) => {
//     let { timeIn, timeOut, dayhrs, timeentryId, timeEditReason } = req.body;

//     let {UserId, roleId} = req.user;

//     let empDetail = await findEmpDetail(UserId);
    
//     if (empDetail.ErrorMsg) throw new ApiError(401, empDetail.ErrorMsg);

//     let {Empnumber, EmpRole} = empDetail;

//     req.TimeentryDetails = {
//         timeIn, timeOut, dayhrs, timeentryId, timeEditReason, Empnumber, EmpRole, roleId
//     }

//     next();
// });

module.exports = {employeeValidation, valdiateLeaves};