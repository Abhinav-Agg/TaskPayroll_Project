const express = require("express");
const router = express.Router();
const { createEmployee, updateEmployeeInfo } = require("../controllers/employee_controller");
const { saveTimeInTimeOut } = require("../controllers/empTimeAttendence_controller");
const { addBulkEmployee } = require("../controllers/import_controller");
const upload = require("../middleware/fileUpload");

// Admin
router.route("/create-emp").post(createEmployee);
router.route("/update-emp").post(updateEmployeeInfo);
router.route("/importemployees").post(upload.single('importEmp'), addBulkEmployee);   // in single, fields, array we add the name of field in which we upload image/file.

// Employee
router.route("/timeentry").post(saveTimeInTimeOut);

module.exports = router; 