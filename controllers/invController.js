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
  if (!vehicle) {
    // Handle the case where the vehicle is not found
    return next({ status: 404, message: 'Vehicle not found' });
  }
  let nav = await utilities.getNav();
  const productMake = vehicle.inv_make;
  const productModel = vehicle.inv_model;
  const productYear = vehicle.inv_year;
  // You might need to add the following line to get the vehicle grid
  // const grid = await utilities.buildVehicleGrid(vehicle);
  // Render the vehicle detail view
  res.render('./inventory/detail.ejs', {
    title: productYear + ' ' + productMake + ' ' + productModel,
    nav,
    // Add 'vehicle' and 'grid' to the view
    vehicle,
    // grid,
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
