const invModel = require("../models/inventory-model")
const Util = {}
/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  // console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}
/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  console.log("____________________________________________________________________")
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  // console.log(grid)
  return grid
}

Util.buildProductViewDetailsGrid = async function(data){
  let grid
  // console.log("____________________________________________________________________")
  if(data.length > 0){
    data.forEach(vehicle => { 
      grid = '<img class ="vehicle_detail_img" src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make +' ' + vehicle.invModel +' ">'
      
      grid += '<div class="vehicle_detail_box">'
      grid += '<h2 class = "vehicle_name">'
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details'
      grid += '</h2>'
      grid += '<p class = "vehicle_price">'
      + '<strong>Price:</strong>' + ' ' + '<strong>' + '$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price)
      grid += '</p>'
      grid += '<p class = "vehicle_year">'
      + '<strong>Year:</strong> ' + ' ' + vehicle.inv_year
      grid += '</p>'
      grid += '<p class="vehicle_color">'
      + '<strong>Color:</strong>' + ' ' + vehicle.inv_color
      grid += '</p>'
      grid += '<p class="vehicle_miles">'
      + '<strong>Miles:</strong>' + ' ' + '<strong>' + ' ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles)
      grid += '</p>'
      grid += '</div>'
    })
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  // console.log(grid)
  return grid
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util