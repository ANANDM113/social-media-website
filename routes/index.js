// Setting up the routes.
// learning link https://expressjs.com/en/guide/routing.html
const express   =   require('express');
//It is pointing to the same instance of express in the original index.js

//To create route handlers
const router    =   express.Router();

//Importing Controller
const homeController    =   require('../controllers/home_controller');

console.log('Router loaded');

//Accessing HomeController
router.get('/',homeController.home);

//for any further routes,access from here
//router.use('/routername',require('./routerfile'));
//So index.js in the route is the main file for Routes and then we can go to other routes
router.use('/users',require('./users'));
router.use('/posts',require('./posts'));
router.use('/comments',require('./comments'));
router.use('/likes',require('./likes'));

router.use('/api',require('./api'));

//Exporting the routes to original index.js
module.exports  =   router;