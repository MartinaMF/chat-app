var socket = io();
socket.on('connect', function(){
  console.log('Connected to the server');
});
socket.on('disconnect',function(){
  console.log('disconnected from server');
});
socket.on('newMessage',function(message){
  var formatedTime = moment(message.createdAt).format('h:mm a');
  var messageList = `<li><p class="messageP">${message.from} ${formatedTime} :${message.text}</p></li>`;
  $('#messages').append(messageList);
});
socket.on('newLocationMessage',function(message){
  var formatedTime = moment(message.createdAt).format('h:mm a');
  var li = `<li>from : ${message.from} ${formatedTime}<a target="blank" href="${message.url}">
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
  var messageTextBox = $('[name=message]');
  socket.emit('createMessage',{
    from : 'User',
    text: messageTextBox.val()
  },function(){
    messageTextBox.val('');
  });
});
var locationButton = $('#send-location');
locationButton.on('click',function(){
  if(!navigator.geolocation){
    return alert('geolocation is not supported in your browser');
  }
  locationButton.attr('disabled','disabled').text('sending location...');

  navigator.geolocation.getCurrentPosition(function(position){
    locationButton.removeAttr('disabled').text('send location');
    socket.emit('createLocationMessage',{
      latitude:position.coords.latitude,
      longitude :position.coords.longitude

    })
  },function(){
    locationButton.removeAttr('disabled').text('send location');
    alert('unable to fetch location')
  });
});
