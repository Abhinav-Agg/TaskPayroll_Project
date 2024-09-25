const asyncHandler = require("../utils/AsyncHandlerWrapper");

const createLeave = asyncHandler(async(req, res) => {
    let {leaveType, empNumber, leaveDays, leaveGranted } = req.body;
    let {userId} = req.user;
    
});