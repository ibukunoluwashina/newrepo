// **********   account routes  ********
// ***** Unit 4, deliver login view activity ***
// **** Needed Resources *******
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

// ****** *********************************
// Deliver Login View
// Unit 4 Delivering Login View Activity
// ****************************************
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// * **********************************************
// * Deliver Registration View
// * Unit 4, deliver registration view activity
// * ***********************************************
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// loggin to change te view to account and logging
// router.get('/login', (req, res) => {
//   // Perform login logic, set req.session.isLoggedIn to true
//   req.session.isLoggedIn = true;
//   res.redirect('/');
// });

router.get('/logout', (req, res) => {
  // Perform logout logic, set req.session.isLoggedIn to false
  req.session.isLoggedIn = false;
  res.redirect('/');
});

// * ***********************************************
// Process Registration 
// Unit 4, Process registration activity
// * ***********************************************
router.post(
    "/register", 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
    )

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// ****************************************
// Default route for the "accounts"
// Deliver Account Management Activity
// Unit 5, JWT Authorization Activity
// ****************************************
router.get(
  "/", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccountManagement)
  )



module.exports = router