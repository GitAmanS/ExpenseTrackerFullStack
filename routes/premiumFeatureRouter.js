const express = require("express");
const router = express.Router();
const premiumFeatureController = require("../controllers/premiumFeatureController");
const userauthentication = require("../middleware/authentication");

router.get(
  "/showLeaderBoard",
  userauthentication.authenticate,
  premiumFeatureController.getUserLeaderBoard
);

module.exports = router;
