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
app.get("/home" , function(req ,res){
    res.end("<h1>welcome to home page</h1>")
})

let port = process.env.PORT || 3000;
httpServer.listen(port ,function(){
    console.log("server Started");
})
