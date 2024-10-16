const express = require("express");
const { createEmployeesLeave, addLeaveRequest, showLeavesDetails } = require("../controllers/leave_controller");
const router = express.Router();

// Admin
router.route("/CreateLeaves").post(createEmployeesLeave);

// Employee
router.route("/AddRequest").post(addLeaveRequest);
router.route("/ShowDetails").get(showLeavesDetails);
//router.route("/Show-Details/:leaveId").get(showLeavesDetails);

module.exports = router;