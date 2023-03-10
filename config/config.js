require('dotenv').config()

const PORT = process.env.PORT || 8000;
const DB = process.env.DB;
const SECRET = process.env.SECRET;

module.exports={
    PORT,
    DB,
    SECRET
}