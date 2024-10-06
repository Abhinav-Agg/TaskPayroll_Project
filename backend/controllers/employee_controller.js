const db = require("../db/dbModel");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandlerWrapper");
const { createUser, createUserRole } = require("./user_controller");
const ApiResponse = require("../utils/ApiResponse");
const { where, Op } = require("sequelize");
const { checkMiddlewareOutput, validateEmpwithEmpNumber } = require("../utils/CommonMethod");

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

    if (existingEmp) throw new ApiError(401, "Employee already exists");

    let empObj = {
        FullName: fullName,
        Empnumber: empNumber,
        Email: email,
        Address: address,
        EmpDepartment: empDepartment,
        EmpDesignation: empDesignation,
        IsActive: 1
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

    if (!empDetail) {
        let deleteUser = await deleteUser(newUserDetail.UserId);

        throw new ApiError(401, "Internal error");
    }

    return res.status(200).json(new ApiResponse(201, "Employee Created successfully", empDetail));
});

// This Method handle by only Admin.
const updateEmployeeInfo = asyncHandler(async (req, res) => {
    try {
        // empNumber -> It will not update , its used for only validate the userDetails.
        let { empNumber, email, address, fullName, empRole, empDepartment, empDesignation } = req.body;
        
        let currentUserDetails = checkMiddlewareOutput(req);
    
        let { Role } = currentUserDetails;
    
        if (Role === 'Employee' || Role === 'Manager') throw new ApiError(401, "You are not authorized to update info");
    
        let empDetail = await validateEmpwithEmpNumber(empNumber);
        
        let {Empnumber , UserId} = empDetail;
    
        let updateEmployeeDetails = {
            Email: email,
            FullName: fullName,
            Address: address,
            EmpRole: empRole,
            EmpDepartment: empDepartment,
            EmpDesignation: empDesignation,
            ModifiedBy : currentUserDetails.UserId
        }
    
        let updateEmpStatus = await db.Employee.update(updateEmployeeDetails,
            {
                where: {
                    [Op.and] : [{Empnumber}, {UserId}]
                }
            }
        );
    
        let updateUserStatus = await db.Users.update({UserEmail : email, Fullname : fullName},
            {
                where: {UserId}
            }
        );
    
        let updateRoleStatus = await db.UserRole.update({Role : empRole},
            {
                where: { UserId }
            }
        );
    
        if((updateEmpStatus[0] && updateRoleStatus[0] && updateUserStatus[0]) === 1) return res.status(200).json(new ApiResponse(201, "Info Updated Sucessfully"));
        
    } catch (error) {
        throw error;
    }
});

module.exports = {
    createEmployee,
    updateEmployeeInfo
};