const { order } = require("../models/order")

const newOrder = async( object ) => {
    return order.create( object )
}

const getCurrentOrder = async( object ) => {
    return order.findOne( object ).sort("-createdAt")
}

const updateStatus = async( id, field) => {
    return order.findByIdAndUpdate( id, field,{ new: true, runValidators: true })
}

const allOrder = async( object ) => {
    return order.find( object )
}


module.exports={ newOrder, getCurrentOrder, updateStatus, allOrder }