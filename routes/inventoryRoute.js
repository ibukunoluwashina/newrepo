// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
//Route to handle the vehicle detail page.
router.get("/detail/:invId", invController.buildVehicleDetail);

// Route for Intentional Error
router.get("/intentional-error", invController.triggerIntentionalError);

// Route to build management view
router.get("/management", invController.showManagementView);

// Route to display the add-classification view
router.get('/add-classification', invController.showAddClassificationView);

// Route to handle form submission
router.post('/add-classification', invController.processAddClassification);

router.get('/add-inventory', invController.showAddInventoryView);

// router to submit car inventory
router.post("add-inventory", invController.regInventory)


module.exports = router;