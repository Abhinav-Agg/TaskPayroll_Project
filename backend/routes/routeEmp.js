const express = require("express");
const router = express.Router();
const { createEmployee, updateEmployeeInfo } = require("../controllers/employee_controller");

// Admin
router.route("/createEmp").post(createEmployee);
router.route("/updateEmp").post(updateEmployeeInfo);

module.exports = router;