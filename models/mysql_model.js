// models/User.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/mysql.db'); // Import the database connection setup

const Request = sequelize.define("Request", {
    time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

// Synchronize the model with the database (creates the "User" table if it doesn't exist)
Request.sync()
  .then(() => {
    console.log('Request model synchronized with the database.');
  })
  .catch((err) => {
    console.error('Error synchronizing Request model:', err);
  });

module.exports = { Request };
