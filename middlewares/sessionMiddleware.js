
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const CONFIG = require("../config/config");


const store = new MongoStore({
    uri: CONFIG.DB,
    collection: "sessions",
});

store.on("error", function (error) {
    console.log(error);
});

module.exports = session({
    secret: CONFIG.SECRET,
    resave: true,
    saveUninitialized: true,
    store: store,
    cookie: { secure: false, httpOnly: true }, // Set secure to true if using HTTPS
});
