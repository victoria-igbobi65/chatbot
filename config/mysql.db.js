// db.js

const Sequelize = require("sequelize")

const sequelize = new Sequelize(
    process.env.MYSQL_DB,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: 'mysql',
        dialect: "mysql",
        port: 3306
    }
)

sequelize
    .authenticate()
    .then(() => {
        console.log("Database connection has been established successfully.")
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err)
    })

module.exports = sequelize