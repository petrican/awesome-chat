var socketio = require('socket.io');


function init(server) {

    var ios = require('socket.io-express-session');
    var expressSession = require('express-session'); // this is for handling sessions
    var session = expressSession({ secret: 'somesecret', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true });

    
    var io = socketio(server);

    io.use(ios(session));

    io.on('connection', function (socket) {
	    
	    console.log(socket.handshake.session);
  
	    socket.on('message', function(message){
    	        
    	        message = JSON.parse(message);
            
        	if(message.type = "userMessage"){
        	    message.username = socket.handshake.session.nickname;    
            	    socket.broadcast.send(JSON.stringify(message));
            	    message.type = "myMessage";
            	    socket.send(JSON.stringify(message));
    	        }
	    });

	    
	    // handle 'set_name' event received on serv
	    socket.on('set_name', function(data){
		socket.handshake.session.nickname = data.name;
		
		// console.log(socket.handshake.session.nickname);
		
		socket.emit('name_set', data);
		socket.send(JSON.stringify({ type: 'serverMessage', message: 'Welcome to the most interesting chat room on earth!' }));
		socket.broadcast.emit('user_entered', data);
		
	    });
	    

    });
    return io;
}

module.exports = init;