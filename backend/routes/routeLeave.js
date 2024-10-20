const express = require("express");
const { createEmployeesLeave, 
    addLeaveRequest, 
    showLeavesDetails, 
    approveLeaves, 
    multipleApproveLeaves,
    showRequestStatusLeaves
     } = require("../controllers/leave_controller");
const router = express.Router();

// Admin
router.route("/CreateLeaves").post(createEmployeesLeave);

// Employee
router.route("/AddRequest").post(addLeaveRequest);
router.route("/ShowDetails").get(showLeavesDetails);
router.route("/ApproveLeaves/:leaveId/:employeeLeaveId").post(approveLeaves);
router.route("/ApproveLeaves").post(multipleApproveLeaves);
router.route("/ShowReqStatusLeaves").get(showRequestStatusLeaves);


/*
Note ->>>>>>> parameters and queryString in route.
1st Parameter URL :->
http://localhost:6060/api/v1/leaves/ApproveLeaves/1 -> it means will send the parameter with the url.
route should for parameter -> router.route("/ApproveLeaves/:leaveId").post(approveLeaves);
in code we get param value from req.param

2nd Query string URL :->
http://localhost:6060/api/v1/leaves/ApproveLeaves/?leaveId:1 -> it means will send the queryString.
route should be this -> router.route("/ApproveLeaves").post(approveLeaves);
In code we get query value from req.query.

----->>> This is the difference b/w in Query and Params
Parms -> using parameter name in route but not in url. Just pass the value.
Query -> not query to add any parameter in route. But in url pass the value with the name of value we can say key value pair (?leaveId=1)
*/


module.exports = router;