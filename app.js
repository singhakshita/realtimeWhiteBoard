const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const io = require('socket.io')(httpServer);
io.on("connection" , function(socket){
    console.log("New Client connected");
    console.log(socket.id);
    socket.on("color" , function(color){
        socket.broadcast.emit('colorchange', color);
        
    })
    socket.on("md" ,function(point){
        socket.broadcast.emit("onmd" ,point);
    })
    socket.on("mm" ,function(point){
        socket.broadcast.emit("onmm" ,point);
    })
})

let port = process.env.PORT || 3000;
httpServer.listen(port ,function(){
    console.log("server Started");
})
