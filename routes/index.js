// Setting up the routes.

const express   =   require('express');
//It is pointing to the same instance of express in the original index.js

//To create route handlers
const router    =   express.Router();

//Importing Controller
const homeController    =   require('../controllers/home_controller');

console.log('Router loaded');

//Accessing HomeController
router.get('/',homeController.home);

//Exporting the routes to original index.js
module.exports  =   router;