const express = require("express");
const { saveEmpTask, updateEmpTask } = require("../controllers/empTask_controller");
const router = express.Router();

router.route("/createtask").post(saveEmpTask);
router.route("/updatetask").post(updateEmpTask);

module.exports = router;