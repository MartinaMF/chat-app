var socket = io();
socket.on('connect', function(){
  console.log('Connected to the server');
});
socket.on('disconnect',function(){
  console.log('disconnected from server');
});
socket.on('newMessage',function(message){
  console.log('new Message' + message.createdAt);
  var messageList = `<li>${message.text}</li>`;
  $('#messages').append(messageList);
});
// socket.emit('createMessage',{
//   from:'Frank',
//   text:'Hi'
// },function(data){
//   console.log('Got it', data);
// });
$('#message-form').on('submit',function(e){
  e.preventDefault();
  socket.emit('createMessage',{
    from : 'User',
    text: $('[name=message]').val()
  },function(){

  });
});
