const path = require('path');
const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const http = require('http');
const socketIO = require('socket.io');
const express = require('express');

const publicPath = path.join(__dirname , '../public');
const port = process.env.PORT || 3000;
const app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
app.use(express.static(publicPath));
io.on('connection', function(socket){
  console.log('New user connected');

  socket.on('join', (params,callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and room nae are required.');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);
    io.to(params.room).emit('updateUserList',users.getUserList(params.room));
    // socket.leave('the office fance');

    //io.emit -> io.to('the office fanc').emit
    //socket.broadcast.emit ->socket.broadcast.tp('').emit
    //socket.emit
    socket.emit('newMessage', generateMessage('Admin','Welcom to the chat app'));
    socket.broadcast.to('params.room').emit('newMessage', generateMessage('Admin',`${params.name} has joined`));
    callback();
  });
  socket.on('disconnect',function(){
    var user = users.removeUser(socket.id);
    if(user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} has left`));
    }
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
