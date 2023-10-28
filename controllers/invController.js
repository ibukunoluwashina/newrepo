const invModel = require("../models/inventory-model");
const utilities = require("../utilities/index");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

// controller function to handle the vehicle detail page.
invCont.buildVehicleDetail = async function (req, res, next) {
  const inv_id = req.params.invId;
  // Retrieve data for the specific vehicle using inv_id
  const vehicle = await invModel.getVehicleById(inv_id);
  console.log("Data from viewVehicleDetails:", vehicle)
  const grid = await utilities.buildProductViewDetailsGrid(vehicle)
  
  let nav = await utilities.getNav();
  const productMake = vehicle.inv_make;
  const productModel = vehicle.inv_model;
  const productYear = vehicle.inv_year;
  
  res.render('./inventory/detail.ejs', {
    title: productYear + ' ' + productMake + ' ' + productModel,
    nav,  
    grid,
  });
};

// a controller function to trigger an intentional error
invCont.triggerIntentionalError = function (req, res, next) {
  // Trigger an intentional error (e.g., by dividing by zero)
  const error = new Error('Intentional error');
  error.status = 500; // Set status to 500 for a server error
  next(error);
};

module.exports = invCont;