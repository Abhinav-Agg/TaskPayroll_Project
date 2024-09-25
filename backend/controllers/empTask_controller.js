// In this employee will add task with their hrs. Also we allow to the manager who have access to save their changes of the employee task hrs.

const asyncHandler = require("../utils/AsyncHandlerWrapper");

const saveSingleTaskWithHrs = asyncHandler(async(req, res) => {
    // first we get the empNumber and check Emp is exist or not with the userid (so that noone will change any employee's task).
    // Now employee will add their task. 

});