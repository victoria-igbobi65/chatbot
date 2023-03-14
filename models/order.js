const mongoose = require('mongoose')
const Schema = mongoose.Schema;

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
    img:{
        type: String,
        required: [true, `Please provide image URl`]
    },
    status:{
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: "pending"
    }
}, { timestamps: true })

const order = mongoose.model('Order', orderSchema)
module.exports={ order };