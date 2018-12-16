var socket = io();
socket.on('connect', function(){
  console.log('connected to server');
  socket.emit('creatEmail',{
    to : 'Timmy',
    text : 'hey.moma'
  });
  socket.emit('createMessage',{
    to:'mom',
    text : 'hi mom'
  });
})
socket.on('disconnect',function(){
  console.log('disconnected from server');
});
socket.on('newEmail',function(email){
  console.log('new email' + email.from);
});
socket.on('newMessage',function(message){
  console.log('new newMessage' + message.time);
})
