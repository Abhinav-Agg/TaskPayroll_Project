const express = require("express");
const router = express.Router();
const { createEmployee, updateEmployeeInfo } = require("../controllers/employee_controller");
const { saveTimeInTimeOut } = require("../controllers/empTimeAttendence_controller");

// Admin
router.route("/createEmp").post(createEmployee);
router.route("/updateEmp").post(updateEmployeeInfo);

// Employee
router.route("/timeentry").post(saveTimeInTimeOut);

module.exports = router;