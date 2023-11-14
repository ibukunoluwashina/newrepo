const pool = require("../database/");
// Import necessary modules and setup your database connection
const db = require("../database/");


/* ***************************
 * Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************
 * Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error);
  }
}

/* ***************************
 * Get a vehicle by inv_id
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [inv_id]
    );
    console.log("Data from getVehicleById:", data.rows);
    return data.rows[0]; 
  } catch (error) {
    console.error('getVehicleById error: ' + error);
    // return null;
  }
}

// Function to insert data into the database

// Function to insert data into the classification_name table
exports.insertClassification = function(classification) {
  const query = 'INSERT INTO public.classification (classification_name) VALUES ($1)';

  // Assuming classification is a string
  return db.query(query, [classification]);
};

// Function to retrieve data for the management view
getDataForManagementView = function() {
  
  return {};
};

async function insertClassification(classification_name) {
  const query = 'INSERT INTO public.classification (classification_name) VALUES ($1)';

  try {
      // Assuming data is an array corresponding to the values in the query
      return await db.query(query, [classification_name]);
      
  } catch (error) {
      console.error(error);
      return false;
  }
};

// add into datanase for add-inventory

async function registerInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
  try {
    const sql = "INSERT INTO account (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}


module.exports = { getClassifications, getInventoryByClassificationId, getVehicleById, registerInventory, insertClassification };
