const db = require("../db/dbModel");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/AsyncHandlerWrapper");

// Here we get Details of Employee's punch. We save that records in db.
// Remaining Part -> need to add the line for handle/send the error status.
const saveTimeInTimeOut = asyncHandler(async (req, res) => {
    try {
        let currentDateTime = new Date();
    
        let { Empnumber, EmpRole, roleId, timeIn, timeOut, dayhrs, timeentryId, timeEditReason } = req.TimeentryDetails;
    
        if (timeentryId) {
    
            let updateData = await updateTimeEntry(timeentryId, { timeIn, timeOut, dayhrs, EmpRole, roleId, Empnumber, timeEditReason, UserId, currentDateTime });
    
            if (updateData.ErrorMsg) throw new ApiError(500, `${updateData.ErrorName} & ${updateData.ErrorMsg}`);  
            // But need to check when I will run api error. Here we check if update time entry returns error. so catch got error or not. or we need to required add this line.
    
            return res.status(200).json(new ApiResponse(201, "Time Added successfully", updateData));
        }
    
        let objTimeentry = {
            TimeIn: timeIn,
            Empnumber: empDetail.Empnumber,
            CreatedBy: UserId,
            IsDeleted: 0,
            Created_at : currentDateTime.toLocaleString(),
            Updated_at : currentDateTime.toLocaleString()
        }
    
        let addTimeentry = await db.EmployeeTimentry.create(objTimeentry);
    
        res.status(200).send(addTimeentry);
        //res.status(200).send(currentUserDetailsWithToken);
    
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

        let {timeIn, timeOut, dayhrs, currentDateTime, Empnumber, roleId, EmpRole} = objUpdateData;

        //Check time overlapping condition for Manager's level
        if((timeentryData.TimeIn > timeIn || timeentryData.TimeIn < timeIn) || (timeentryData.TimeOut > timeOut || timeentryData.timeOut < timeOut)){

        }


        // Convert the time strings into Date objects
        const timeInDate = new Date(timeIn);
        const timeOutDate = new Date(timeOut);

        let timeDifference = timeOutDate - timeInDate;

        // Convert the difference to minutes
        const differenceInMinutes = Math.floor(timeDifference / (1000 * 60));
        const time24hrsInMin = 24 * 60;
        
        if(differenceInMinutes > time24hrsInMin){
            return { ErrorMsg: "You cannot enter time above 24hrs"};
        }

        // Convert the difference to hours
        dayhrs = (timeDifference / (1000 * 60 * 60)).toFixed(2); // To 2 decimal places

        // Adding a second condition with Role one condition for two reasons:
        // 1. roleId 0 is for Employee
        // 2. When a manager times out, the system should only allow updating the timeout, not the timein.
        if (roleId > 0 && Empnumber !== timeentryData.Empnumber) {
            let updateStatus = await db.EmployeeTimentry.update(
                {
                    TimeIn: timeIn,
                    TimeOut: timeOut,
                    DayHrs: dayhrs,
                    ModifiedReason: `${objUpdateData.EmpRole} : ${objUpdateData.timeEditReason}`,
                    ModifiedBy: Empnumber,
                    Updated_at : currentDateTime.toLocaleString()
                },
                {
                    where: { TimeentryId: timeentryId }
                }
            );

            return { "ManagerLvlUpdateStatus": updateStatus }
        }

        if (Empnumber === timeentryData[0]?.Empnumber && timeentryData[0]?.TimeOut === ''){
            let updateStatus = await db.EmployeeTimentry.update(
                {
                    TimeOut: timeOut,
                    DayHrs: dayhrs,
                    ModifiedReason: `${EmpRole} Added own Timeout`,
                    ModifiedBy: Empnumber,
                    Updated_at : currentDateTime.toLocaleString()
                },
                {
                    where: { TimeentryId: timeentryId }
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