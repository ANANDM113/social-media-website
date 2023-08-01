const express   =   require('express');
const app   =   express();
const port  =   8000;
const expressLayouts    =   require('express-ejs-layouts');
const db    =   require('./config/mongoose');

//Accessing Static files
app.use(express.static('./assets')); 

//Using Layout Library
app.use(expressLayouts);

//extract styles and scripts from sub pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScript',true);

//Using the express router imported from routes/index.js
app.use('/',require('./routes'));

//set up the view engine
app.set('view engine','ejs');
app.set('views','./views'); //path where to look

app.listen(port,function(err){
    if(err){
        console.log(`Error in running server: ${err}`);
    }
    console.log(`Server is running on: ${port}`);
});