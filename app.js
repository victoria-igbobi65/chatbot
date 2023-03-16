/* MODULE IMPORTS */
const express = require("express");
const http = require('http')
const { Server } = require('socket.io');
const cors = require('cors')
const cookieParser = require('cookie-parser') 
const wrap = require('./middlewares/wrap')
const CONFIG = require('./config/config')
require('./config/db')( CONFIG.DB ) /*DB connection*/ 
const errorMiddleware = require('./middlewares/error')
const connectionMiddleware = require('./middlewares/connection')
const sessionMiddleware = require('./middlewares/sessionMiddleware') 

/* VARIABLE DECLARATIONS */
const app = express();
const server = http.createServer(app);
const io = new Server(server)
const PORT = CONFIG.PORT 



/*MIDDLEWARES*/
app.use(sessionMiddleware) /* Session Middleware */
app.use( express.static('public') ) /* Static Files */
app.use(cookieParser()) /* Parse Cookies*/
app.use( cors())
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public' + '/chatbot.html')
})


io.use(wrap( sessionMiddleware ));
io.on("connection", connectionMiddleware )
io.on('error', errorMiddleware )


server.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})