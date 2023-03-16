var express = require('express');
var app= express();
var server = app.listen(5001);     //important serving port
app.use(express.static('public'));

console.log("Server is running");

var socket = require('socket.io');
var io= socket(server);
io.sockets.on('connection', newConnection);

//--send events 
setInterval(heartBeat, 30);



let playersMap = new Map()


function newConnection(socket){  
  socket.on('init', init)
  socket.on('data', handleData);
  

  function init(initData){    //initialization handshake
    console.log("New connection with id:" + socket.id)
  
    //store players with unique ids
    playersMap.set(socket.id,  initData)
    socket.emit('sucess', socket.id)
  }


  function handleData(data){
    playersMap.set(socket.id, data)
    // console.log(playersMap)
  }

}

function heartBeat(){
  let transitString = JSON.stringify(Array.from(playersMap));   //serialize map
  io.sockets.emit('heartBeat', transitString)
}


