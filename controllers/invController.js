const invModel = require("../models/inventory-model");
const utilities = require("../utilities/index");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, _next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0] ? data[0].classification_name : null;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

// controller function to handle the vehicle detail page.
invCont.buildVehicleDetail = async function (req, res, _next) {
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
invCont.triggerIntentionalError = function (_req, _res, next) {
  // Trigger an intentional error (e.g., by dividing by zero)
  const error = new Error('Intentional error');
  error.status = 500; // Set status to 500 for a server error
  next(error);
};

// Controller method to show the management view
invCont.showManagementView = async function(req, res, next){
  // Retrieve data from the model if needed
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList()
  // Render the view and pass the data
  res.render("./inventory/management", {  
    title:"Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
});
};

// Controller method to show the add-classification view
invCont.showAddClassificationView = async function(req, res, next) {
  let nav = await utilities.getNav();
  // Render the view
  res.render('./inventory/add-classification.ejs',{
    title:'Add New Classification',
    nav,
  });
};

// Controller method to process form submission
invCont.processAddClassification = async function(req, res, next) {
  const { classification_name } = req.body;

  // Server-side validation
  if (!classification_name) {
    req.flash('error', 'Invalid classification name. Please check your input.');
    return res.redirect('./inventory/add-classification');
}

// Insert data into the database
const success = await invModel.insertClassification(classification_name );
let nav = await utilities.getNav();
if (success) {
    req.flash('success', 'Classification added successfully.');
    res.render('./inventory/management',{
      title:'Management',
      nav,})
} else {
    req.flash('error', 'Failed to add classification. Please try again.');
    return res.redirect('./inventory/add-classification');
}
};




/* ****************************************
*  Deliver inventory view
* *************************************** */
invCont.showAddInventoryView = async function(req, res, next) {
  let nav = await utilities.getNav()
  let buildClassificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add inventory",
    nav,
    buildClassificationList,
    errors: null,
  })
}

invCont.regInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
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
    inv_color,
  } = req.body

  const price = parseInt(inv_price) //convert string to number
   const miles = parseInt(inv_miles)

  const result = invModel.registerInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    price,
    miles,
    inv_color,
    )

if (result) {
  req.flash(
    "notice",
    `Congratulations, you have registered vehicle ${inv_make} ${inv_model}.`
  )
  res.status(201).render("./inventory/management", {
    title: "Vehicle Management ",
    nav,
    errors: null,
  })
} else {
  req.flash("notice", "Sorry, the vehicle couldnt be added.")
  res.status(501).render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
  })
}
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInvItem = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}




module.exports = invCont