//module.exports will export (home) action outside. we will importing it in route

module.exports.home =   function(request,response){
    return response.end('<h1>Express is up for Codeial!</h1>');
}