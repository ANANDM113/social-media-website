//We are taking the input data from post and preventing it to submit via normal method instead we are
//sending it via ajax to post_controller.js create action where it will receive ajax request in xhr
// format(xmlHttpRequest), In ajax request we will serialize the data which convert it into json format
//with key as content and data entered as value

//method to submit data entered for new post using AJAX
{
    let createPost  =   function(){
        let newPostForm =   $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost =   newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button',newPost));

                    //call the create comment class
                    new PostComments(data.data.post._id);
                    
                    //Change: Enable the functionality of the toggle like button on the new post
                    new ToggleLike(' .toggle-like-button',newPost);

                    new Noty({
                        theme: 'relax',
                        text: "Post published",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();

                },error: function(error){
                    console.log(error.responseText);
                }
            })
        });
    }

    //method to create a post in DOM
    //Dynamically adding content to a web page using JavaScript from JSON received from the server
    //Also show the count of zero likes on this post
    let newPostDom  =   function(post){
        return $(`<li id="post-${post._id}">
                        <p>
                            <small>
                                <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
                            </small>
                            ${post.content}
                            <br>
                            <small>
                                ${post.user.name}
                            </small> 
                            <br>
                        
                            <small>
                                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                                    0 Likes
                                </a>
                            </small>   
                        </p>
                        <div class="post-comments">
                                <form action="/comments/create" method="POST">
                                    <input type="text" name="content" placeholder="Type Here to add comment..." required>
                                    <!-- For which post id comments are being added -->
                                    <input type="hidden" name="post" value="${post._id}">
                                    <input type="submit" value="Add Comment">
                                </form>
                            <div class="post-comments-list">
                                <ul id="post-comments-${post._id}">

                                </ul>
                            </div>
                        </div>
                    </li>`)
    }

    //method to delete a post from DOM
    //we have just created a function to delete post on DOM but we need to get the post id from the
    //server, so actions will be sending it back to the ajax function
    let deletePost  =   function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post._id}`).remove();
                },error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    createPost();
}