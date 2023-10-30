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
const sessionMiddleware = require('./middlewares/sessionMiddleware'); 
const { Request } = require("./models/mysql_model");
const { order } = require("./models/order");

/* VARIABLE DECLARATIONS */
const app = express();
const server = http.createServer(app);
const io = new Server(server)
const PORT = CONFIG.PORT 



/*MIDDLEWARES*/
app.use(sessionMiddleware) /* Session Middleware */
app.use( express.static('public') ) /* Static Files */
app.use(cookieParser()) /* Parse Cookies*/
app.use( cors()) /* Allow cors from any origin*/
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public' + '/chatbot.html')
})
app.get('/sample', async(req, res) => {
    try{
        const request = await Request.create({ time: Date.now(), ip: req.ip })
        const order = await order.create({
            userid: "a27b9d88-3ada-42c7-81ee-f66c9a9a2e7e",
            itemid: "2",
            itemname: "pizza",
            img: "./img/pizza1.jpg",
            status: "pending"
        })
        res.status(200).json({
            msg: 'writing data to both database was a success'
        })
    }
    catch(err){
        res.status(500).json({ error: "An error occurred", err })
    }
})


io.use(wrap( sessionMiddleware ));
io.on("connection", connectionMiddleware )
io.on('error', errorMiddleware )


server.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})