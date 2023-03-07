const express = require("express");
const { Server } = require('socket.io');
const http = require('http');
const CONFIG = require('./config/config')
require('./config/db')( CONFIG.DB )

const app = express();
const server = http.createServer(app);
const io = new Server(server)
const PORT = CONFIG.PORT 

/*MIDDLEWARES*/
app.use(express.static('public'))
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public' + '/chatbot.html')
})

io.on("connection", (socket) => {
    
    console.log("client connected", socket.id)
    socket.emit("connected", "connected to backend server");
})

server.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})