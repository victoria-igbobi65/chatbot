const { v4: uuidv4 } = require('uuid')
const { Menu } = require('../helpers')
const { newOrder, getCurrentOrder, updateStatus, allOrder } = require('../services/order')

const connectionMiddleware = (socket) => {
    const session = socket.request.session
    let userID = session.userId

    if (!userID) {
        userID = uuidv4()
        session.userId = userID
        session.save((err) => {
            if (err) {
                console.error('Error saving session:', err)
            } else {
                console.log('Saved user ID to session:', userID)
            }
        })
        console.log('New user joined!')
        socket.emit(
            'welcome',
            'Welcome to food order chatbot, How may i help you today?'
        )
    } else {
        console.log('old member')
        socket.emit(
            'welcome',
            'Welcome back to food order chatbot, How may i help you today?'
        )
    }

    console.log('client connected', socket.id)

    socket.on('request', async function (data) {
        console.log(data)
        if (data.action === '1') {
            socket.emit('user_request', 'place order')
            socket.emit('bot_response', {
                message: 'please check below for menu 👇',
                menu: Menu,
            })
        } else if (data.action === '88') {
            socket.emit('user_request', 'Go Back')
            socket.emit('welcome', 'Select An action below 👇')
        } else if (data.action === '0') {
            const currentOrder = await getCurrentOrder({ userid: userID })
            const status = 'cancelled'
            socket.emit(
                'user_request',
                `Cancel my current Order: ${currentOrder.itemname}`
            )

            if (currentOrder && currentOrder.status === 'pending') {
                await updateStatus(currentOrder._id, { $set: { status } })
                socket.emit(
                    'cancel_response',
                    `Your current order ${currentOrder.itemname} has been cancelled`
                )
            } else {
                socket.emit(
                    'cancel_response',
                    "You haven't placed any order yet"
                )
            }
        } else if (data.action === '99') {
            const currentOrder = await getCurrentOrder({ userid: userID })
            const status = 'completed'
            socket.emit(
                'user_request',
                `Checkout my current Order: ${currentOrder.itemname}`
            )

            if (currentOrder && currentOrder.status === 'pending') {
                await updateStatus(currentOrder._id, { $set: { status } })
                socket.emit(
                    'cancel_response',
                    `Your current order ${currentOrder.itemname} has been ordered!`
                )
            } else {
                socket.emit(
                    'cancel_response',
                    "You haven't placed any order yet"
                )
            }
        } else if (data.action === '97') {
            const currentOrder = await getCurrentOrder({ userid: userID })
            socket.emit('user_request', `See my current Order`)

            if (currentOrder && currentOrder.status === 'pending') {
                socket.emit(
                    'cancel_response',
                    `Your Current Order: ${currentOrder.itemname}`
                )
            } else {
                socket.emit('menu_response', "You haven't placed any order yet")
            }
        } else if (data.action === '98') {
            const orders = await allOrder({ userid: userID })
            socket.emit('user_request', 'See my Order History')

            if (orders.length > 0) {
                socket.emit('history', orders)
            } else {
                socket.emit('')
            }
        }
    })
    socket.on('order', async function (data) {
        console.log(data)
        const order = Menu.find((item) => item.key === data.key)
        await newOrder({
            userid: userID,
            itemid: data.key,
            itemname: data.value,
        })
        socket.emit('user_request', `My Current Order: ${data.value}`)
        socket.emit(
            'menu_response',
            `Order: ${data.value} Price: ${order.price}`
        )
    })
}

module.exports=connectionMiddleware;