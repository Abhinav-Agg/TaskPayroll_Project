const asyncHandler = require("../utils/AsyncHandlerWrapper");


// Todo points.
/*
1. Create user leave.
2. Edit leave by itself user and manager.
3. approve and reject the leaves.
4. show leaves with balance, approved, leavetype.
*/

const createLeave = asyncHandler(async(req, res) => {
    let {leaveType, empNumber, leaveDays, leaveGranted } = req.body;
    let {userId} = req.user;
    
});