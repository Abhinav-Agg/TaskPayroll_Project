const db = require("../db/dbModel");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandlerWrapper");
const { createUser } = require("./user_controller");
const ApiResponse = require("../utils/ApiResponse");
const { where, Op } = require("sequelize");

const createEmployee = asyncHandler(async (req, res) => {
    console.log(req);
    let { fullName, empNumber, email, address, userLogin, userPassword, empDepartment, empDesignation } = req.body;

    let reqsVal = [fullName, empNumber, email, address, userLogin, userPassword, empDepartment, empDesignation].some(value => value === "");

    let existingEmp = await db.Employee.findOne({
        where:
        {
            [Op.or]:
                [
                    { Email: email }, { Empnumber: empNumber }
                ]
        }
    });

    if (existingEmp) throw new ApiError(401, "Employee already exists")

    if (reqsVal) throw new ApiError(401, "field empty");

    let empObj = {
        FullName : fullName,
        Empnumber : empNumber,
        Email : email,
        Address : address,
        EmpDepartment : empDepartment,
        EmpDesignation : empDesignation
    }

    let userObj = {
        fullName,
        email,
        userLogin,
        userPassword
    }

    let newUserDetail = await createUser(userObj);

    empObj.UserId = newUserDetail.UserId;
    // need to add user role table with userid and add that role id in employee table.

    let empDetail = await db.Employee.create(empObj);

    if(!empDetail) throw new ApiError(401, "Internal error");

    return res.status(200).json(new ApiResponse(201, "Employee Created successfully",));
});

const updateEmployee = asyncHandler(async (req, res) => {
    let {} = req.body;
});

// updat Employee

module.exports = { createEmployee };