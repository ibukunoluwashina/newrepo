/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"));
app.use("/inv", inventoryRoute)
//Index route-Unit 3, activity
app.get("/", utilities.handleErrors(baseController.buildHome))
// inventory routes unit 3, activity
app.use("/inv", require("./routes/inventoryRoute"));
  

// File Not Found Route - must be last route in list
  app.use(async (req, res, next) => {
    next({status: 404, message: 'Sorry, we appear to have lost that page.'});
  });

// Inventory routes

// compering code
app.use(static) //application itself will use this resource
//Index route
app.use("/inv", inventoryRoute) //composed of 3 elements app.use an Express function that directs the application, /inv is a keyword in our app, indicating that a route contains this word, inventoryRoute is the variable representing the inventoryRoute.js file
app.get("/", utilities.handleErrors(baseController.buildHome)) //altered for MVC to execute the function in controller, build nav bar to index.ejs & then wrapped in error handler.
// File not found route - must be last route in list
app.use(async (req, res, next) => { //the Express use function containing an async arrow function.
  next({status: 404, message: 'Sorry, we appear to have lost that page.'}) // the next function to pass control to the next function in the processing chain. (this one an error object.)
})







/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
