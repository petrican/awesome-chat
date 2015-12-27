
var socket = io();


socket.on('name_set', function(data){
    // console.log(data);

    $('#nameform').hide();
    $('#messages').append('<div class="systemMessage">'+ 'Hello '+ data.name + '</div>');
});





$(function(){

    $('#setname').click(function(){
	socket.emit("set_name", { name: $('#nickname').val() });
    });



    $('#send').click(function(){
	var data = {
	    message:  $('#message').val(),
	    type:     'userMessage'    
	};
	socket.send(JSON.stringify(data));
	$('#message').val('');
	$('#message').attr('placeholder','');
	$('#message').focus();
    });
    
    // message broadcast from the server
    socket.on('message', function(data){
	
	data = JSON.parse(data);
	// console.log(data);
	
	if(data.username){
    	    $('#messages').append('<div class="'+data.type+'"><span class="name">' + data.username + ':</span> ' + data.message + '</div>');
        } else {
    	    $('#messages').append('<div class="'+data.type+'">' + data.message + '</div>');    
        }
    });
    
    //New user entered
    socket.on('user_entered', function(user){
	console.log('USER_ENTERED');
	console.log(user);
        $('#messages').append('<div class="systemMessage">'+user.name+ ' has join the room. </div>');
    });

});