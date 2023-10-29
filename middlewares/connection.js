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
        socket.emit('welcome', 'Hey👋🏻!, I am the restaurant\'s automated assistant. How can i help you today?')
    } else {

        console.log('old member')
        socket.emit( 'welcome', 'Welcome back 👋🏻, I am the restaurant\'s automated assistant. How can i help you today?' )

    }

    console.log('client connected', socket.id)

    socket.on("disconnect", () => {
        console.log("client disconnected", socket.id)
    })

    socket.on('request', async function ( data ) {

        console.log( data )
        /* Gets executed when a '1' event occurs */
        if ( data.action === '1' ) {

            socket.emit( 'user_request', 'place order' )
            socket.emit( 'bot_response', { message: 'Menu List', menu: Menu })
        } 
        /* Gets executed when a  '88' event occurs */
        else if ( data.action === '88' ) {

            socket.emit( 'user_request', 'Go Back' )
            socket.emit( 'welcome', 'Select An action below 👇' )
        } 
        /* Gets executed when a '0' event occurs */
        else if ( data.action === '0' ) {

            const currentOrder = await getCurrentOrder({ userid: userID })
            const status = 'cancelled'
            socket.emit('user_request', `Cancel my current Order `)

            if ( currentOrder && currentOrder.status === 'pending' ) {

                await updateStatus(currentOrder._id, { $set: { status } })
                socket.emit( 'cancel_response', { message: `Your current order ${currentOrder.itemname} has been cancelled`, object: currentOrder } )

            } else {

                socket.emit( 'completed_response', "You haven't placed any order yet")
            }
            
        } 
        /* Gets executed when a '99' event occurs */
        else if ( data.action === '99' ) {

            const currentOrder = await getCurrentOrder({ userid: userID })
            const status = 'completed'
            socket.emit( 'user_request', ` Checkout my current Order ` )

            if ( currentOrder && currentOrder.status === 'pending' ) {

                await updateStatus( currentOrder._id, { $set: { status } })
                socket.emit( 'cancel_response', { message: `Your current order ${ currentOrder.itemname } has been ordered!`, object: currentOrder } )

            } else {

                socket.emit( 'completed_response', "You haven't placed any order yet")

            }
        } 
        /* Gets executed when a '97' event gets called */
        else if ( data.action === '97' ) {

            const currentOrder = await getCurrentOrder({ userid: userID })
            socket.emit( 'user_request', `See my current Order` )

            if ( currentOrder && currentOrder.status === 'pending' ) {

                socket.emit( 'cancel_response', { message: `Your Current Order: ${ currentOrder.itemname }`, object: currentOrder } )

            } else {

                socket.emit( 'completed_response', "You haven't placed any order yet" )

            }
        } 
        /* Gets executed when a '98' event occurs */
        else if (data.action === '98') {

            const orders = await allOrder({ "status": { $in: ['completed', 'cancelled'] }, userid: userID })
            socket.emit('user_request', 'See my Order History')
            socket.emit('history', orders)

        }
    })
    /* Gets carried out when the order event occurs */
    socket.on( 'order', async function ( data ) {

        console.log( data )
        const order = Menu.find( ( item ) => item.key === data.key )
        await newOrder({
            userid: userID,
            itemid: data.key,
            img: data.img,
            itemname: data.value,
        })
        socket.emit( 'user_request', `My Current Order: ${ data.value }` )
        socket.emit( 'menu_response', { message: `${ data.value } ${ order.price }`, object: order } )
    })
}

module.exports=connectionMiddleware;