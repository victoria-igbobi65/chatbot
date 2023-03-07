require('dotenv').config()

const PORT = process.env.PORT || 8000;
const DB = process.env.DB;

module.exports={
    PORT,
    DB
}