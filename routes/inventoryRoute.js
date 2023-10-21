// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
//Route to handle the vehicle detail page.
router.get("/detail/:inv_id", invController.buildVehicleDetail);

// Route for Intentional Error
router.get("/intentional-error", invController.triggerIntentionalError);

module.exports = router;