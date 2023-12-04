const express = require("express");
const router = express.Router();
const forgotPassController = require("../controllers/forgotPassController.js");


router.post("/", forgotPassController.forgotPassword);
router.get("/resetPassword/:id", forgotPassController.resetPassword);
router.post("/updatePassword/:id", forgotPassController.updatePassword);

module.exports = router;