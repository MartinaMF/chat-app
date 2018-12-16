const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const express = require('express');

const publicPath = path.join(__dirname , '../public');
const port = process.env.PORT || 3000;
const app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));
io.on('connection', function(socket){
  console.log('New user connected');
  socket.emit('newEmail',{
    from : 'martina faragalla',
    text : 'hey how u doing'
  });
  socket.on('creatEmail', function(newEmail){
    console.log('creat Email' , newEmail)
  });
  socket.on('disconnect',function(){
  console.log('client disconnected');
  });
  socket.on('createMessage',function(message){
    console.log('new message' + message.text + new Date());
  });
  socket.emit('newMessage', {
    text : 'hello',
    time : new Date(),
    from : 'Timmy'
  });
});

server.listen(port, ()=>{
  console.log(`server is running on ${port}`);
});
