const { Op, where } = require("sequelize");
const { EmployeeLeaves, Leaves } = require("../db/dbModel");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/AsyncHandlerWrapper");
const { validateEmpwithEmpNumber, findEmpDetail, checkMiddlewareCurrentUser } = require("../utils/CommonMethod");
const db = require("../db/dbModel");

// This created by only Addmin and Hr-admins
const createEmployeesLeave = asyncHandler(async(req, res) => {
    let currentDateTime = new Date();
    
    let {empnumber, grantedLeaves, leaveEffectiveFrom, leaveEfectiveTo  } = req.body;

    let {UserId, Role} = req.user;

    if(Role === "Manager" || Role === "Employee" || Role === "Operations") throw new ApiError(401, "You have not access to create Leaves");

    let currentSystemDate = new Date(currentDateTime.getTime() - currentDateTime.getTimezoneOffset() * 60000);  // With this logic we get current system's date.

    let empDetail = await validateEmpwithEmpNumber(empnumber);

    if(empDetail.ErrorMsg) throw new ApiError(401, empDetail.ErrorMsg);

    let dataEmpLeaveExists = await EmployeeLeaves.findOne({where : {Empnumber : empDetail.Empnumber, IsActive : 1}});

    if(dataEmpLeaveExists?.IsActive === 1 
        && dataEmpLeaveExists?.Empnumber === empDetail.Empnumber 
        && dataEmpLeaveExists?.LeavesEffectiveFrom === leaveEffectiveFrom  
        && dataEmpLeaveExists?.LeavesEffectiveTo === leaveEfectiveTo) {
            throw new ApiError(401, "This Employee Exists with Same Data");
        }

    let objEmpLeave = {
        Empnumber : empDetail.Empnumber,
        LeavesGranted : grantedLeaves,
        LeavesEffectiveFrom : leaveEffectiveFrom,
        LeavesEffectiveTo : leaveEfectiveTo,
        IsActive : 1,
        IsDeleted : 0,
        CreatedBy : UserId,
        CreatedAt : currentSystemDate,
        UpdatedAt : currentSystemDate
    }

    let addedLeaveDetailsForEmp = await EmployeeLeaves.create(objEmpLeave);
    
    res.status(200)
        .json(new ApiResponse(201, addedLeaveDetailsForEmp));
});

// Employees
const addLeaveRequest = asyncHandler(async(req, res) => {
    // In this Employee send the request for leave.
    // We will add the data in leaves table.
    // we need to check leaves lies in effective from and effective to or not.
    let {leaveType, leaveDays, balanceLeaves, leaveFrom, leaveTo, leaveReason} = req.body;

    let {UserId} = req.user;

    let empDetail = await findEmpDetail(UserId);
    
    if(empDetail.ErrorMsg) throw new ApiError(401, empDetail.ErrorMsg);

    let empLeaveDetail = await EmployeeLeaves.findOne({
        where:
        {
            Empnumber: empDetail.Empnumber, IsActive: 1,
            LeavesEffectiveFrom : {
                [Op.lte] : new Date(leaveFrom)
            },
            LeavesEffectiveTo : {
                [Op.gte] : new Date(leaveTo)
            }
        }
    });

    if(!empLeaveDetail) throw new ApiError(401, "Please contact your System Administrator for leaves expired or add leaves");

    if(leaveDays > balanceLeaves) throw new ApiError(400, "Insufficient Balance Leaves");

    let leaveDetails = {
        EmployeeLeaveId : empLeaveDetail.EmployeeLeaveId,
        LeaveType : leaveType,
        LeaveDays : leaveDays,
        LeaveFromDate : new Date(leaveFrom),
        LeaveToDate : new Date(leaveTo),
        LeaveReason : leaveReason,
        BalanceLeaves : balanceLeaves,
        CreatedBy : UserId
    }

    let leaveReqDetails = await Leaves.create(leaveDetails);

    res.status(200).send(new ApiResponse(201, leaveReqDetails));
});

// Employees
const showLeavesDetails = asyncHandler(async(req, res) => {

    let currentUserDetails = checkMiddlewareCurrentUser(req);

    let empDetail = await findEmpDetail(currentUserDetails.UserId);

    if(empDetail.ErrorMsg) throw new ApiError(401, empDetail.ErrorMsg);
    
    let getLeaveDetailsInstance = await Leaves.findAll({
        attributes : ["LeaveType", "BalanceLeaves", "LeaveStatus", "LeaveReason", "LeaveFromDate", "LeaveToDate", "RejectedReason"],
        include : [{
            model : db.EmployeeLeaves,
            attributes : ["Empnumber", "LeavesGranted"],
            required : true,
            where : {Empnumber : empDetail.Empnumber}
        }]
    });

    let leaveDetails = getLeaveDetailsInstance.map(instance => instance.get({plain : true}));
    
    // Need to add code when leaves have no details. Means Emp is new and need to add details.
    return res.send(new ApiResponse(201, "details", leaveDetails));
});

// Manager and HR_Admin
const approveLeaves = asyncHandler(async(req, res) => {
    // Need to test this yet.....................
    let {LeaveId} = req.params;

    let currentUserDetails = checkMiddlewareCurrentUser(req);

    if(currentUserDetails === "Employee") throw new ApiError(401, "You don't have access to approved leaves");

    let getLeaveDetails = await Leaves.findAll({
        where : {LeaveStatus : "REQ"}
    });

    if(!getLeaveDetails) return res.status(200).send(new ApiResponse(201, "No Leaves Pending for Approve"));

    let {BalanceLeaves} = getLeaveDetails;

    BalanceLeaves -= LeaveDays;

    let leaveUpdateStatus = await Leaves.update(
        {
            LeaveStatus : "APV",
            ApprovedBy : currentUserDetails.UserId,
            BalanceLeaves,
            ModifiedBy : currentUserDetails.UserId
        },
        {
            where : {LeaveId}
        }
    );

    if(leaveUpdateStatus[0] === 1)
        return res.status(200).send(new ApiResponse(201, "Leave Approved"));

    // Need to test this yet.....................
});

// Manager
const rejectLeaves = asyncHandler(async(req, res) => {
    // Here Manager will reject the leaves.
    // Will do calcualtion for balance leaves when manager rejected the leaves. We need to add those leaves in balance leaves.
});

// Employees
const withdrawLeaves = asyncHandler(async(req, res) => {
    // Here Empoyee will withdraw the leaves.
    // System will add these leaves in balance leaves. 
});

// Import Leave Employees -> Coming Soon

module.exports = {
    createEmployeesLeave,
    addLeaveRequest,
    showLeavesDetails,
    approveLeaves
}