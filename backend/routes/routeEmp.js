const express = require("express");
const router = express.Router();
const { createEmployee } = require("../controllers/employee_controller");

router.route("/createEmp").post(createEmployee);

module.exports = router;