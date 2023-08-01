//module.exports will export (home) action outside. we will importing it in route

module.exports.home =   function(request,response){
    //direct rendering it
    //return response.end('<h1>Express is up for Codeial!</h1>');

    //rendering the View(home.ejs)
    return response.render('home',{
        title: "Home"
    });
}