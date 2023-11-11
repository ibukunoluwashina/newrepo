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

// Controller method to show the management view
invCont.showManagementView = async function(req, res){
  // Retrieve data from the model if needed
  let nav = await utilities.getNav();
  // Render the view and pass the data
  res.render('./inventory/management.ejs', {  
    title:"Vehicle Management",
nav,
});
};

// Controller method to show the add-classification view
invCont.showAddClassificationView = async function(req, res) {
  let nav = await utilities.getNav();
  // Render the view
  res.render('./inventory/add-classification.ejs',{
    title:'Add New Classification',
    nav,
  });
};

// Controller method to process form submission
invCont.processAddClassification = function(req, res) {
  const { classificationName } = req.body;

  // Server-side validation
  if (!classificationName(classificationName)) {
    req.flash('notice', 'Invalid classification name. Please check your input.');
    return res.redirect('/inv/add-classification');
}

// Insert data into the database
const success = invModel.insertClassification({ classificationName });

if (success) {
    // Update navigation bar and render the management view
    req.app.locals.nav = getUpdatedNavigationBar();
    req.flash('notice', 'Classification added successfully.');
    return res.redirect('/inv/management');
} else {
    req.flash('notice', 'Failed to add classification. Please try again.');
    return res.redirect('/inv/add-classification');
}
};

module.exports = invCont;