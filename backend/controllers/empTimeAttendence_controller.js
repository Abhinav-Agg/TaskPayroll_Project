const db = require("../db/dbModel");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/AsyncHandlerWrapper");
const { checkMiddlewareOutput, findEmpDetail } = require("../utils/CommonMethod");

// Here we get Details of Employee's punch. We save that records in db.
// Remaining Part -> need to add the line for handle/send the error status.
const saveTimeInTimeOut = asyncHandler(async (req, res) => {
    try {
        let { timeIn, timeOut, dayhrs, timeentryId, timeEditReason } = req.body;
    
        let currentUserDetails = checkMiddlewareOutput(req);
    
        let empDetail = await findEmpDetail(currentUserDetails.UserId);
    
        if (empDetail.ErrorMsg) throw new ApiError(401, empDetail.ErrorMsg);
    
        let { Empnumber, EmpRole } = empDetail;
    
        if (timeentryId) {
    
            let updateData = await updateTimeEntry(timeentryId, { timeIn, timeOut, dayhrs, EmpRole, Empnumber, timeEditReason, ...currentUserDetails });
    
            if (updateData.ErrorMsg) throw new ApiError(500, `${updateData.ErrorName} & ${updateData.ErrorMsg}`);  
            // But need to check when I will run api error. Here we check if update time entry returns error. so catch got error or not. or we need to required add this line.
    
            return res.status(200).json(new ApiResponse(201, "Time Added successfully", updateData));
        }
    
        let objTimeentry = {
            TimeIn: timeIn,
            Empnumber: empDetail.Empnumber,
            createdBy: currentUserDetails.UserId,
            IsDeleted: 0
        }
    
        let addTimeentry = await db.EmployeeTimentry.create(objTimeentry);
    
        res.status(200).send(addTimeentry);
    
    } catch (error) {
        throw error;
    }

});


// This function used for edit and its only done by Manager.
const updateTimeEntry = async (timeentryId, objUpdateData) => {
    try {
        let timeentryInstanceData = await db.EmployeeTimentry.findAll({ where: { TimeentryId: timeentryId } });

        if (!timeentryInstanceData) return { ErrorMsg: "User tries to edit other employee's timeentry" };

        let timeentryData = timeentryInstanceData.map(instance => instance.get({ plain: true }));

        // Adding a second condition with Role one condition for two reasons:
        // 1. A manager can only update other employees' time entries, not their own.
        // 2. When a manager times out, the system should only allow updating the timeout, not the timein.
        if (objUpdateData.Role === "Manager" && objUpdateData.Empnumber !== timeentryData.Empnumber) {
            let updateStatus = await db.EmployeeTimentry.update(
                {
                    TimeIn: objUpdateData.timeIn,
                    TimeOut: objUpdateData.timeOut,
                    DayHrs: objUpdateData.dayhrs,
                    ModifiedReason: objUpdateData.timeEditReason,
                    ModifiedBy: objUpdateData.Empnumber
                },
                {
                    where: { TimeentryId: timeentryId }
                }
            );

            return { "ManagerLvlUpdateStatus": updateStatus }
        }

        if (objUpdateData.timeIn === timeentryData[0]?.TimeIn) {
            let updateStatus = await db.EmployeeTimentry.update(
                {
                    TimeOut: objUpdateData.timeOut,
                    DayHrs: objUpdateData.dayhrs,
                    ModifiedReason: "Employee Added their Timeout",
                    ModifiedBy: objUpdateData.Empnumber
                },
                {
                    where: { TimeentryId: timeentryId, Empnumber: objUpdateData.Empnumber }
                }
            );

            return updateStatus;
        }

    } catch (error) {
        return {
            ErrorName: error.name,
            ErrorMsg: error.message
        };
    }
};

const deleteTimeEntry = asyncHandler(async (req, res) => {

});


// This report is returns the results of monthly basis employee.
const createAttendanceReport = asyncHandler(async (req, res) => {

});


module.exports = {
    saveTimeInTimeOut,
    updateTimeEntry
}