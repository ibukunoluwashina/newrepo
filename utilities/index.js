const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken");
require("dotenv").config()
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
      + '" title="view ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="view ' 
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

// *********build the product view***************
Util.buildProductViewDetailsGrid = async function(data){
  // let grid
  // console.log("____________________________________________________________________")
  // if(data.length > 0){
      let grid = '<img class="vehicle_detail_img" src="' + data.inv_image + '" alt="Image of ' + data.inv_make +' ' + data.invModel +' ">'
      
      grid += '<div class="vehicle_detail_box">'
      grid += '<h2 class= "vehicle_name">'
      + data.inv_make + ' ' + data.inv_model + ' details'
      grid += '</h2>'
      grid += '<p class= "vehicle_price">'
      + '<strong>Price:</strong>' + ' ' + '<strong>' + '$' + new Intl.NumberFormat('en-US').format(data.inv_price)
      grid += '</p>'
      grid += '<p class = "vehicle_year">'
      + '<strong>Year:</strong> ' + ' ' + data.inv_year
      grid += '</p>'
      grid += '<p class="vehicle_color">'
      + '<strong>Color:</strong>' + ' ' + data.inv_color
      grid += '</p>'
      grid += '<p class="vehicle_miles">'
      + '<strong>Miles:</strong>' + ' ' + '<strong>' + ' ' + new Intl.NumberFormat('en-US').format(data.inv_miles)
      grid += '</p>'
      grid += '</div>'
    
  // } else { 
  //   grid= '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  // }
  // console.log(grid)
  return grid
}

// build classification list
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
  '<select name="classification_id" id="classificationList">'
  classificationList += "<option>Choose a Classification</option>"
  data.rows.forEach( (row) => {
  classificationList += '<option value="' + row.classification_id + '"' 
  if (
    classification_id != null &&
    row.classification_id == classification_id
  ){
  classificationList +=" selected "
  }
  classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>" 
  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("notice", "Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * Unit 5, jwt authorize activity
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


 /* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTTokenAuthz = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("notice", "Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     if (accountData.account_type === "Employee" || accountData.account_type ==="Admin") {
      // res.locals.accountData = accountData.account_type
      res.locals.authzLoggedin = 1
      console.log("auth account type check")
      next()
     }
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * Unit 5, jwt authorize activity
 * ************************************ */
 Util.checkLoginAuthz = (req, res, next) => {
  if (res.locals.authzLoggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.") 
    return res.redirect("/account/login")
  }
 }

 


module.exports = Util