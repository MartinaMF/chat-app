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
socket.on('newLocationMessage',function(message){
  var li = `<li>from : ${message.from}<a target="blank" href="${message.url}">
  My current location</a>
  </li>`;
  $('#messages').append(li);
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
var locationButton = $('#send-location');
locationButton.on('click',function(){
  if(!navigator.geolocation){
    return alert('geolocation is not supported in your browser');
  }
  navigator.geolocation.getCurrentPosition(function(position){
    socket.emit('createLocationMessage',{
      latitude:position.coords.latitude,
      longitude :position.coords.longitude

    })
  },function(){
    alert('unable to fetch location')
  });
});
