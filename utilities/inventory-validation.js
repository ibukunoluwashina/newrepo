const utilities = require(".")
const accountModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
    return [
      // classification ID
      body("classification_id")
    .custom((value, { req }) => {
      if (!value) {
        throw new Error("A classification name is required. Please select one.");
      }
      return true; // La validación pasa si value no es nulo ni una cadena vacía
    })
      .withMessage("A classification name is required. Plase select one."), // on error this message is sent.
  
      // inv_make is required and must be string
      body("inv_make")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Please provide a make."), // on error this message is sent.

        // inv_model is required and must be int
      body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a model."), // on error this message is sent.

      body("inv_year")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Please provide the year."), // on error this message is sent.

      body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the description."), // on error this message is sent.

      body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the image url."), // on error this message is sent.

      body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the thumbnail url."), // on error this message is sent.

      body("inv_price")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the price."), // on error this message is sent.

      body("inv_miles")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the miles."), // on error this message is sent.

      body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the color."), // on error this message is sent.

    ]
  }
/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { 
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
         } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let buildClassificationList = await utilities.buildClassificationList()
      res.render("./inventory/add-inventory", {
        errors,
        title: "Add Inventory",
        nav,
        buildClassificationList,
        classification_id, 
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
      })
      return
    }
    next()
  }
  
  module.exports = validate