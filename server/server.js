const path = require('path');
const {generateMessage,generateLocationMessage} = require('./utils/message');
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
  socket.emit('newMessage', generateMessage('Admin','Welcom to the chat app'));
  socket.broadcast.emit('newMessage', generateMessage('Admin','New user join'));
  socket.on('disconnect',function(){
  console.log('client disconnected');
  });
  socket.on('createMessage',function(message,callback){
    io.emit('newMessage',generateMessage(message.from, message.text));
    callback('this is from the server');
    console.log(message);
    // socket.broadcast.emit('newMessage',{
    //   from : message.from,
    //   text: message.text,
    //   createdAt:new Date().getTime()
    // });
  });
  socket.on('createLocationMessage',function(coords){
    io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude))
  });
});

server.listen(port, ()=>{
  console.log(`server is running on ${port}`);
});
