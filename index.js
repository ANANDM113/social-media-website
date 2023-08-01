const express   =   require('express');
const app   =   express();
const port  =   8000;

//Using the express router imported from routes/index.js
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log(`Error in running server: ${err}`);
    }
    console.log(`Server is running on: ${port}`);
});