const mongoose = require('mongoose')
const Schema = new mongoose.Schema;

const orderSchema = new Schema({
    userid:{
        type: String,
        required: [true, 'Provide user ID!']
    },
    itemid:{
        type: String,
        required: [true, 'Please provide the ID of the item!']
    },
    itemname:{
        type: String,
        required: [true, 'Please provide item name!']
    },
    status:{
        type: String,
        enum: ['pending', 'completed', 'cancelled']
    }
})

const order = mongoose.model('Order', orderSchema)
module.exports={ order };