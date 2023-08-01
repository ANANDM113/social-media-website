const express   =   require('express');
const app   =   express();
const port  =   8000;

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