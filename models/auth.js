const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const authSchema = new Schema({
    _id: {
        type: String,
        required: [true, 'User unique identity required!']
    },
    sessiondata: {
        type: mongoose.Schema.Types.Mixed
    }
})