const express = require("express");
const router = express.Router();

router.route("/test").post((req,res) => {
    res.send("its working");
});

module.exports = router;