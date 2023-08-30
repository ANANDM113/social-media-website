//module.exports will export (home) action outside. we will importing it in route

/*
module.exports.home =   function(request,response){
    //direct rendering it
    //return response.end('<h1>Express is up for Codeial!</h1>');

    //playing with cookies
    //Accessing from browser
    console.log(request.cookies);
    
    //updating the cookie
    response.cookie('user_id',49);
    
    //rendering the View(home.ejs)
    return response.render('home',{
        title: "Home"
    });
}
*/
const Post  =   require('../models/post');
const User  =   require('../models/user');
//This will post comment on home.ejs but it will not display user
/*
module.exports.home =   function(request,response){

    Post.find({}) //Post.find{} will select everything in Post.js(models)
        .then((posts) =>{ 
            return response.render('home',{
                title: "Codeial | Home",
                posts: posts
            })
        })    
}
*/

//This will post comment and also display user we will make use of mongoose populate concept
//Post.find({}).populate('user'), this will prepopulate the user
//https://mongoosejs.com/docs/populate.html
//We are also populating comments for that specific post
module.exports.home =   function(request,response){
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec()
    .then((posts) =>{

        User.find({})
        .then((users) => {
            return response.render('home',{
                title: "Codeial | Home",
                posts: posts,
                all_users: users
            })
        });

    })
}

