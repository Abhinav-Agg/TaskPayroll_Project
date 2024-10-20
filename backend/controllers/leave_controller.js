const { Op, where } = require("sequelize");
const { EmployeeLeaves, Leaves } = require("../db/dbModel");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/AsyncHandlerWrapper");
const { validateEmpwithEmpNumber, findEmpDetail, checkMiddlewareCurrentUser } = require("../utils/CommonMethod");
const db = require("../db/dbModel");

// This created by only Addmin and Hr-admins
const createEmployeesLeave = asyncHandler(async (req, res) => {
    let currentDateTime = new Date();

    let { empnumber, grantedLeaves, leaveEffectiveFrom, leaveEfectiveTo } = req.body;

    let { UserId, Role } = req.user;

    if (Role === "Manager" || Role === "Employee" || Role === "Operations") throw new ApiError(401, "You have not access to create Leaves");

    let currentSystemDate = new Date(currentDateTime.getTime() - currentDateTime.getTimezoneOffset() * 60000);  // With this logic we get current system's date.

    let empDetail = await validateEmpwithEmpNumber(empnumber);

    if (empDetail.ErrorMsg) throw new ApiError(401, empDetail.ErrorMsg);

    let dataEmpLeaveExists = await EmployeeLeaves.findOne({ where: { Empnumber: empDetail.Empnumber, IsActive: 1 } });

    if (dataEmpLeaveExists?.IsActive === 1
        && dataEmpLeaveExists?.Empnumber === empDetail.Empnumber
        && dataEmpLeaveExists?.LeavesEffectiveFrom === leaveEffectiveFrom
        && dataEmpLeaveExists?.LeavesEffectiveTo === leaveEfectiveTo) {
        throw new ApiError(401, "This Employee Exists with Same Data");
    }

    let objEmpLeave = {
        Empnumber: empDetail.Empnumber,
        LeavesGranted: grantedLeaves,
        LeavesEffectiveFrom: leaveEffectiveFrom,
        LeavesEffectiveTo: leaveEfectiveTo,
        IsActive: 1,
        IsDeleted: 0,
        CreatedBy: UserId,
        CreatedAt: currentSystemDate,
        UpdatedAt: currentSystemDate
    }

    let addedLeaveDetailsForEmp = await EmployeeLeaves.create(objEmpLeave);

    res.status(200)
        .json(new ApiResponse(201, addedLeaveDetailsForEmp));
});

// Every Employees
const addLeaveRequest = asyncHandler(async (req, res) => {
    let { leaveType, leaveDays, balanceLeaves, leaveFrom, leaveTo, leaveReason } = req.body;

    let { UserId } = req.user;

    let empDetail = await findEmpDetail(UserId);

    if (empDetail.ErrorMsg) throw new ApiError(401, empDetail.ErrorMsg);

    let empLeaveDetail = await EmployeeLeaves.findOne({
        where:
        {
            Empnumber: empDetail.Empnumber, IsActive: 1,
            LeavesEffectiveFrom: {
                [Op.lte]: new Date(leaveFrom)
            },
            LeavesEffectiveTo: {
                [Op.gte]: new Date(leaveTo)
            }
        }
    });

    if (!empLeaveDetail) throw new ApiError(401, "Please contact your System Administrator for leaves expired or add leaves");

    if (leaveDays > balanceLeaves) throw new ApiError(400, "Insufficient Balance Leaves");

    let leaveDetails = {
        EmployeeLeaveId: empLeaveDetail.EmployeeLeaveId,
        LeaveType: leaveType,
        LeaveDays: leaveDays,
        LeaveFromDate: new Date(leaveFrom),
        LeaveToDate: new Date(leaveTo),
        LeaveReason: leaveReason,
        BalanceLeaves: balanceLeaves,
        LeaveStatus: "REQ",
        CreatedBy: UserId
    }

    let leaveReqDetails = await Leaves.create(leaveDetails);

    res.status(200).send(new ApiResponse(201, leaveReqDetails));
});

// Every Employees -> This api shows only their details.
const showLeavesDetails = asyncHandler(async (req, res) => {

    let currentUserDetails = checkMiddlewareCurrentUser(req);

    let empDetail = await findEmpDetail(currentUserDetails.UserId);

    if (empDetail.ErrorMsg) throw new ApiError(401, empDetail.ErrorMsg);

    let getLeaveDetailsInstance = await Leaves.findAll({
        attributes: ["LeaveId", "EmployeeLeaveId", "LeaveType", "BalanceLeaves", "LeaveStatus", "LeaveDays", "LeaveReason", "LeaveFromDate", "LeaveToDate", "ApprovedBy", "RejectedBy", "RejectedReason"],
        include: [{
            model: db.EmployeeLeaves,
            attributes: ["Empnumber", "LeavesGranted"],
            required: true,
            where: { Empnumber: empDetail.Empnumber }
        }]
    });

    let leaveDetails = getLeaveDetailsInstance.map(instance => instance.get({ plain: true }));

    return res.send(new ApiResponse(201, "details", leaveDetails));
});

// Manager and HR_Admin
const approveLeaves = asyncHandler(async (req, res) => {
    let { leaveId, employeeLeaveId } = req.params;

    let currentUserDetails = checkMiddlewareCurrentUser(req);

    let { UserId, Role } = currentUserDetails;

    if (Role === "Employee") throw new ApiError(401, "You don't have access to approved leaves");

    // By this we reduce the two calls in one call with OR condition.
    let leaveDetails = await Leaves.findAll({
        where : {
            [Op.or] : [{LeaveStatus : "REQ", LeaveId: leaveId }, {LeaveStatus: "APV", EmployeeLeaveId: employeeLeaveId}]
        },
        order: [["UpdatedAt", "DESC"]] 
    });

    let getReqLeaveDetails = leaveDetails.find(leaves => leaves.LeaveStatus === "REQ");

    if (!getReqLeaveDetails) return res.status(200).send(new ApiResponse(201, "No Leaves Pending for Approve"));

    let getbalanceLeaveAPVDetails = leaveDetails.find(leaves => leaves.LeaveStatus === "APV");

    let { BalanceLeaves, LeaveDays } = getReqLeaveDetails;

    // Determine the updated balance
    let newBalance;
    if (getbalanceLeaveAPVDetails) {
        newBalance = getbalanceLeaveAPVDetails.BalanceLeaves - LeaveDays;

    } else {
        // If no approved leave found, use the current requested leave balance
        newBalance = BalanceLeaves - LeaveDays;
    }

    let leaveUpdateStatus = await Leaves.update(
        {
            LeaveStatus: "APV",
            ApprovedBy: UserId,
            BalanceLeaves: newBalance,
            ModifiedBy: UserId
        },
        {
            where: { LeaveId: leaveId }
        }
    );

    if (leaveUpdateStatus[0] === 1)
        return res.status(200).send(new ApiResponse(201, "Leave Approved"));

});

// Manager -> Here manager also see details of other employees in manager setion leaves request module.
const showRequestStatusLeaves = asyncHandler(async (req, res) => {
    const { UserId } = req.user;

    let empDetail = await findEmpDetail(UserId);

    if (empDetail.EmpRole === "Employee") throw new ApiError(401, "You don't have access");

    const reqStatusLeaveDetails = await Leaves.findAll({
        attributes: ["LeaveId", "EmployeeLeaveId", "LeaveType", "LeaveStatus", "BalanceLeaves", "LeaveDays", "LeaveReason", "LeaveFromDate", "LeaveToDate"],
        include: [{
            model: db.EmployeeLeaves,
            required: true,
            attributes: [], // Exclude all EmployeeLeaves columns
            where: {
                Empnumber: {
                    [Op.ne]: [empDetail.Empnumber]
                }
            }
        }],
        where: { LeaveStatus: "REQ" }
    });

    if (!reqStatusLeaveDetails) res.status(200).send(new ApiResponse(201, "No Pending Leaves"));

    return res.status(200).json(new ApiResponse(201, "Leave Details", reqStatusLeaveDetails));
});

// Manager -> Allow approve Multiple leaves.
const multipleApproveLeaves = asyncHandler(async (req, res) => {
    let { checkedLeaveIdsData } = req.body;

    let currentUserDetails = checkMiddlewareCurrentUser(req);

    let { UserId } = currentUserDetails;

    if (currentUserDetails.Role === "Employee") throw new ApiError(401, "You don't have access to approved leaves");

    let empUpdatedBalanceLeaves = {};  // By this object we didn't require to fetch the details from backend. It saves a read call.

    try {
        let leaveUpdateStatuses = checkedLeaveIdsData.map((leaveDetail) => {
            let { BalanceLeaves, LeaveDays, LeaveId, EmployeeLeaveId } = leaveDetail;

            // By this we will catch same employeeLeaveId balance leave which already udpated.
            if (empUpdatedBalanceLeaves["employeeLeaveId"] === EmployeeLeaveId) {
                BalanceLeaves = empUpdatedBalanceLeaves["balanceLeave"] - LeaveDays;
            }
            else {
                BalanceLeaves -= LeaveDays;
            }

            empUpdatedBalanceLeaves["balanceLeave"] = BalanceLeaves;
            empUpdatedBalanceLeaves["employeeLeaveId"] = EmployeeLeaveId;
            empUpdatedBalanceLeaves["leaveId"] = LeaveId;

            // Each Leaves.update returns a promise
            return Leaves.update(
                {
                    LeaveStatus: "APV",
                    ApprovedBy: UserId,
                    BalanceLeaves,
                    ModifiedBy: UserId
                },
                {
                    where: { LeaveStatus: "REQ", LeaveId }
                }
            );
        });

        // Await all promises concurrently
        let updateStatus = await Promise.all(leaveUpdateStatuses);

        let resUpdateStatus = updateStatus.some((status) => status[0] === 1);

        if (!resUpdateStatus) throw new ApiError(401, "Something went wrong");

        return res.status(200).send(new ApiResponse(201, "Leave Approved Successfully"));

    } catch (error) {
        console.error('Error in updating leaves:', error);
    }

});

// Manager
const rejectLeaves = asyncHandler(async (req, res) => {
    // Here Manager will reject the leaves.
    // Will do calcualtion for balance leaves when manager rejected the leaves. We need to add those leaves in balance leaves.
});

// Employees
const withdrawLeaves = asyncHandler(async (req, res) => {
    // Here Empoyee will withdraw the leaves.
    // System will add these leaves in balance leaves. 
});

// Import Leave Employees -> Coming Soon

module.exports = {
    createEmployeesLeave,
    addLeaveRequest,
    showLeavesDetails,
    approveLeaves,
    multipleApproveLeaves,
    showRequestStatusLeaves
}