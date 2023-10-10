// It is the subscriber or user communicating from the client side and subscribing to the observer
//This class is going to send request for connection

class ChatEngine{
    constructor(chatBoxId,userEmail){
        this.chatBoxId  =   $(`#${chatBoxId}`);
        this.userEmail  =   userEmail;

        //io is a global variable that we get when we wrote cdn script in home.ejs
        this.socket =   io.connect('http://localhost:5000');

        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){

        let self    =   this;

        this.socket.on('connect',function(){
            console.log('Connection established using sockets...');

            //user emits to the server(chat_sockets.js in config)
            self.socket.emit('join_room',{
                user_email: self.userEmail,
                chatroom: 'codeial'
            });

            //user detects the emitted event from the server
            self.socket.on('user_joined',function(data){
                console.log('a user joined',data);
            })
        });


        // send a msg on clicking the send message button
        $('#send-message').click(function(){
            let msg =   $('#chat-message-input').val();

            if(msg != ''){
                self.socket.emit('send_message',{
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial'
                });
            }
        });

        // Now detect receive_message and create an <li>. detect whether the message is yours or from 
        //other user via email id then append that msg and email
        self.socket.on('receive_message',function(data){
            console.log('message received',data);

            let newMessage =   $('<li>');

            let messageType =   'other-message';

            if(data.user_email  ==  self.userEmail){
                messageType =   'self-message';
            }

            newMessage.append($('<span>',{
                'html' : data.message
            }));

            newMessage.append($('<sub>',{
                'html' : data.user_email
            }));

            newMessage.addClass(messageType);

            $('#chat-message-list').append(newMessage);
        })
    }
}