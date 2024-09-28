const db = require("../db/dbModel");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandlerWrapper");
const { createUser, createUserRole } = require("./user_controller");
const ApiResponse = require("../utils/ApiResponse");
const { where, Op } = require("sequelize");

const createEmployee = asyncHandler(async (req, res) => {
    let { fullName, empNumber, email, address, userLogin, userPassword, empDepartment, empDesignation, empRole } = req.body;

    let reqsVal = [fullName, empNumber, email, address, userLogin, userPassword, empDepartment, empDesignation, empRole].some(value => value === "");

    if (reqsVal) throw new ApiError(401, "field empty");

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

    let empObj = {
        FullName : fullName,
        Empnumber : empNumber,
        Email : email,
        Address : address,
        EmpDepartment : empDepartment,
        EmpDesignation : empDesignation,
        IsActive : 1
    }

    let userObj = {
        fullName,
        email,
        userLogin,
        userPassword
    }

    // Get UserDeatils
    let newUserDetail = await createUser(userObj);

    // Get UserRoleDetails
    let userRoleDetails = await createUserRole(newUserDetail.UserId, empRole);

    empObj.UserId = newUserDetail.UserId;
    
    empObj.EmpRole = userRoleDetails.Role;

    // Get EmpDetails with UserRole and UserId
    let empDetail = await db.Employee.create(empObj);

    if(!empDetail){
        let deleteUser = await deleteUser(newUserDetail.UserId);
        
        throw new ApiError(401, "Internal error");
    } 

    return res.status(200).json(new ApiResponse(201, "Employee Created successfully", empDetail));
});

const updateEmployee = asyncHandler(async (req, res) => {
    let {} = req.body;
});

// update Employee

module.exports = { createEmployee };