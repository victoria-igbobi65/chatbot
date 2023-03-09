const express = require("express");
const { Server } = require('socket.io');
const http = require('http');
const cookieParser = require('cookie-parser') 
const { v4: uuidv4} = require('uuid')
const sessionMiddleware = require('./middlewares/sessionMiddleware')
const CONFIG = require('./config/config')
require('./config/db')( CONFIG.DB )

const app = express();
const server = http.createServer(app);
const io = new Server(server)
const PORT = CONFIG.PORT 



/*MIDDLEWARES*/
app.use(sessionMiddleware)
app.use( express.static('public') )
app.use(cookieParser())
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public' + '/chatbot.html')
})


io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
  
});

io.on("connection", async(socket) => {
    const session = socket.request.session;
    let userID = session.userId

    if ( !userID ){
        userID = uuidv4();

        socket.request.session.userId = userID 
        session.save((err) => {
          if (err) {
            console.error("Error saving session:", err);
          } else {
            console.log("Saved user ID to session:", userID);
          }
        });
        console.log("New user joined!");
        socket.emit("welcome", "Welcome to food order chatbot, How may i help you today?");
    }
    else{
        console.log('old member')
        socket.emit("welcome", "Welcome back to food order chatbot, How may i help you today?");
    }
    
    console.log("client connected", socket.id)
    
})

server.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})