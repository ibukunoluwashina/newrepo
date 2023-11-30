// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const regValidate = require('../utilities/inventory-validation')
const utilities = require('../utilities')


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
//Route to handle the vehicle detail page.
router.get("/detail/:invId", invController.buildVehicleDetail);


// Route for Intentional Error
router.get("/intentional-error", invController.triggerIntentionalError);

// Route to build management view
router.get("/", invController.showManagementView);

// Route to display the add-classification view
router.get('/add-classification', invController.showAddClassificationView);

// Route to handle form submission
router.post('/add-classification', invController.processAddClassification);

router.get('/add-inventory', invController.showAddInventoryView);


// ****************************************************
// *** get inventory for AJAX Route
// *** Unit 5, Select inv item activity
// ****************************************************
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// router to submit car inventory
// router.post("/add-inventory", invController.regInventory)

// validation for the add-inventory
router.post(
    "/add-inventory", 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(invController.regInventory)
    )


// Route to handle editing inventory items
router.get("/inv/edit/:inv_id", utilities.handleErrors(invController.editInvItem));

module.exports = router;