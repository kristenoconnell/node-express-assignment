const { NODE_ENV = "development" } = process.env
const express = require("express");
const app = express();

//Middleware & zoo function
const { validateZip } = require("./middleware/validateZip.js");
const { getZoos } = require("./utils/getZoos.js")

//All zoos route
app.get(
  "/zoos/all", 
  (req, res, next) => {
    const admin = req.query.admin;
    if (admin === "true") {
       const zoos = getZoos().join("; ");
      res.send(`All zoos: ${zoos}`);
    } else {
      res.send("You do not have access to that route.");
    }
})


//Check zip route
app.get("/check/:zip", validateZip, (req, res, next) => {
  const zip = req.params.zip;
  const zoo = getZoos(zip);
    if (zoo !== undefined) {
      res.send(`${zip} exists in our records.`)
    } else {
      res.send(`${zip} does not exist in our records.`);
    }
  })

//Zoo zip route
app.get("/zoos/:zip", validateZip, 
  (req, res, next) => {
    const zip = req.params.zip;
    const zoos = getZoos(zip);
    if (zoos !== undefined && zoos.length !== 0) {
      const content = zoos.length > 1 ? zoos.join("; ") : zoos;
    res.send(`${zip} zoos: ${content}`)
  } else {
    res.send(`${zip} has no zoos.`)
  }
})



//No-route found error
app.use((req, res, next) => {
  res.send("That route could not be found!");
})

//General error handler
app.use((error, req, res, next) => {
  res.send(error);
})

module.exports = app;