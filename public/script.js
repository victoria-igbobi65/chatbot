const socket = io("ws://localhost:5000");

const buttons = [
  { key: "1", value: "Place Order" },
  { key: "99", value: "Checkout Order" },
  { key: "98", value: "Order History" },
  { key: "97", value: "Current Order" },
  { key: "0", value: "Cancel Order" },
];

/* HELPER FUNCTION */
const appendMessage = (userType, message) =>{
  const welcomeMessageElement = document.getElementById("chat-window");
  const classN = userType ? "message-bot" : "message-user";
  const p = document.createElement("p");
  p.textContent = `${message}`;
  p.className = classN;
  welcomeMessageElement.appendChild(p);
}

const appendButton = ( itemList, menu ) => {
  let buttonContainer = document.getElementById("button-container");
  buttonContainer.innerHTML= ''
  const handle = menu? handleButtonClick: handleMenuButtonclick
  const buttons = itemList.map((item) => {
    const button = document.createElement('button')
    button.setAttribute('id', item.key)
    button.innerHTML = item.value;
    button.addEventListener('click', () => {
      //handleButtonClick(item.key)
      handle( item )
    })
    buttonContainer.appendChild( button )
    return button;
  })

}


const cardContainer = ( list ) => {
    const card = document.getElementById('message-container')

    const orderHistoryCard = document.createElement('div')
    orderHistoryCard.classList.add('card')

    const orderHistoryHeader = document.createElement('h2')
    orderHistoryHeader.innerText = 'ORDER HISTORY'
    orderHistoryCard.appendChild(orderHistoryHeader)

    for (let order of list ) {
        const orderItem = document.createElement('p')
        orderItem.innerText = `Item: ${ order.itemname } ==> Status: ${ order.status }`
        orderHistoryCard.appendChild(orderItem)
    }
    card.appendChild(orderHistoryCard)

}

const button = ( text, object ) => {

    const button = document.createElement('button')
    button.innerHTML = text
    button.addEventListener('click', () => {
        handleButtonClick( object )
    })
    return button

}

/* EVENT HANDLERS */
const handleButtonClick = ( object ) => {
  socket.emit('request', { action: object.key })
}

const handleMenuButtonclick = ( userRequest ) => {
  socket.emit("order", userRequest )
}


/* EVENT EMITTERS */
socket.on("welcome", function (msg) {

    setTimeout(() => {

        appendMessage(true, msg)
        appendButton(buttons, true)
        
    }, 200)

});

socket.on("user_request", function( msg ){

  appendMessage( false, msg )

})

socket.on("bot_response", function( data ){
  setTimeout(()=> {

    appendMessage(true, data.message);
    appendButton(data.menu, false);

  }, 500)
})

socket.on("cancel_response", function( msg ){

  setTimeout(() => {
      appendMessage(true, msg )
  }, 500)

  let buttonContainer = document.getElementById('button-container')
  buttonContainer.innerHTML = ''
  const button1 = button('Back', { key: '88', value: 'Back' })

  buttonContainer.appendChild( button1 )


  
})

socket.on('history', function(data){

  setTimeout(() => {
      cardContainer( data )

      let buttonContainer = document.getElementById('button-container')
      buttonContainer.innerHTML = ''

      const button1 = button('Checkout Order', { key: '99', value: 'Checkout Order' } )
      const button2 = button('Cancel Order', {key: '0', value: 'Cancel Order'})
      const button3 = button('Back', { key: '88', value: 'Back' })
      const button4 = button('Place Order', { key: '1', value: 'Back' })
      

      buttonContainer.appendChild(button1)
      buttonContainer.appendChild(button2)
      buttonContainer.appendChild(button3)
      buttonContainer.appendChild( button4)

  }, 500)
})

socket.on("menu_response", function( msg ){
    setTimeout(() => {
        appendMessage(true, msg)

        let buttonContainer = document.getElementById('button-container')
        buttonContainer.innerHTML = ''

        const button1 = button('Checkout Order', { key: '99', value: 'Checkout Order' } )
        const button2 = button('Cancel Order', { key: '0', value: 'Cancel Order' })
        const button3 = button('Back', { key: '88', value: 'Back' })

        buttonContainer.appendChild(button1)
        buttonContainer.appendChild(button2)
        buttonContainer.appendChild( button3)

    }, 500)
  
})


