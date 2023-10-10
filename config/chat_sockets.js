//It is the observer or the server
//Now lets receive a request for connection

// module.exports.chatSockets  =   function(socketServer){
//     // This io will be handling the connection 
//     let io  =   require('socket.io')(socketServer);

//     io.sockets.on('connection',function(socket){
//         console.log('New Connection received',socket.id);

//         socket.on('disconnect',function(){
//             console.log('Socket disconnected');
//         });
//     });
// }

module.exports.chatSockets  =   function(socketServer){
    // This io will be handling the connection 
    const io  =   require('socket.io')(socketServer,{
        cors:{
            origin: "http://localhost:8000",
            methods: ["GET", "POST"]
        }
    });

    //server detects a new connection request
    io.sockets.on('connection',function(socket){
        console.log('New Connection received',socket.id);

        socket.on('disconnect',function(){
            console.log('Socket disconnected');
        });

        //server detects a new user request to join the chat room (chat_engine.js in assets/js)
        //if the room with that name doesnot exist it creates it
        socket.on('join_room',function(data){
            console.log('joining request received',data);

            //server adds the new user in chatroom
            socket.join(data.chatroom);

            //server emits the addition of new user to all the other users in that chatroom with the 
            //new user data
            io.in(data.chatroom).emit('user_joined',data);
        });

        //detect send_message and broadcast to everyone in the room
        socket.on('send_message',function(data){
            io.in(data.chatroom).emit('receive_message',data);
        });
    });

}