const socket = io('ws://localhost:5000')

// so i need something to keep track of tries, like if the user click on back, to start again, the bot needs to know that its a need request;
var tries = 1
// when a button is clicked, u need to remove the onlick function, so user will not click it twice;

const buttons = [
    { key: '1', value: 'Place Order' },
    { key: '99', value: 'Checkout Order' },
    { key: '98', value: 'Order History' },
    { key: '97', value: 'Current Order' },
    { key: '0', value: 'Cancel Order' },
]

/* HELPER FUNCTION */

const notificationSound = new Audio("./audio/pop.mp3")

function disableButtons() {
    const buttons = document.querySelectorAll('button')
    buttons.forEach((button) => {
        button.disabled = true
    })
}

function scrollToBottom() {
    var chatContainer = document.getElementById("chat-window")
    chatContainer.scrollTop = chatContainer.scrollHeight
}


const appendMessage = (userType, message, msgPos = '') => {
    const welcomeMessageElement = document.getElementById('chat-window')
    const classN = userType ? 'message-bot' : 'message-user'

    // if this is the first response
    if (msgPos == 'isFirst') {
        const msg_wrapper = document.createElement('div')
        msg_wrapper.classList.add('msg_wrapper')
        msg_wrapper.innerHTML = `
    <img src="./img/pizza.jpg" class="shadow-xs img-fluid rounded-top" alt="pizza">
    <h6 class="msg_wrapper_tsitle mt-1 fw-bold text-black">${ message }</h6>
    <div class="buttons w-100" id="order_list_buttons${tries}">
    
    </div>`
        welcomeMessageElement.appendChild(msg_wrapper)
    } else if (msgPos == 'menu') {
        // if the response is menu do this
        const msg_wrapper = document.createElement('div')
        msg_wrapper.classList.add('msg_wrapper')
        // msg_wrapper.classList.add(classN)
        msg_wrapper.innerHTML = `
        <h6 class="msg_wrapper_tsitle fw-bold text-black">${message}</h6>
        <div class="menus">
          <div class="d-flex flex-wrap" id="menu_btn_wrapper${tries}">
          </div>
        </div`
        welcomeMessageElement.appendChild(msg_wrapper)
    } else if (msgPos == 'menu_response') {
        // if the response is menu do this
        const msg_wrapper = document.createElement('div')
        msg_wrapper.classList.add('msg_wrapper')
        // msg_wrapper.classList.add(classN)
        msg_wrapper.innerHTML = `
        <img src=${ message.object.img } class="shadow-xs img-fluid rounded-top" alt="pizza">        
        <p class="btn menu_response active rounded bg-light border-0 m-1 outline-0 fw-400 btn-sm px-4 py-2"> ${message.message.replace(
            'Order ',
            ''
        )} </p>
        <div class="menus">
          <div class="d-flex flex-wrap" id="menu_response_btn_wrapper${tries}">
          </div>
        </div`
        welcomeMessageElement.appendChild(msg_wrapper)
    } else if (msgPos == 'completed') {
        // if message is = completed
        const msg_wrapper = document.createElement('div')
        msg_wrapper.classList.add('msg_wrapper')
        // msg_wrapper.classList.add(classN)
        msg_wrapper.innerHTML = `
         <h6 class="msg_wrapper_tsitle fw-bold text-black">${message}</h6>
         <div id="completed_button-container${tries}" class="mt-3">
         </div>
         `
        welcomeMessageElement.appendChild(msg_wrapper)
    } else if (msgPos == 'notCompleted') {
        const msg_wrapper = document.createElement('div')
        msg_wrapper.classList.add('msg_wrapper')

        // msg_wrapper.classList.add(classN)
        msg_wrapper.innerHTML = `<img src=${ message.object.img } class="shadow-xs img-fluid rounded-top" alt="pizza">
        <h6 class="msg_wrapper_tsitle fw-bold text-black">${ message.message }</h6>
        <div id="notCompleted${tries}" class="mt-3"></div>`

        welcomeMessageElement.appendChild(msg_wrapper)
    } else if (userType) {
        // just any other response coming from the bot
        const msg_wrapper = document.createElement('div')
        msg_wrapper.classList.add('msg_wrapper')
        // msg_wrapper.classList.add(classN)
        msg_wrapper.innerHTML = `<h6 class="msg_wrapper_tsitle fw-bold text-black">${message}</h6>`
        welcomeMessageElement.appendChild(msg_wrapper)
    } else {
        const div = document.createElement('div')
        div.className = 'd-flex justify-content-end my-2'

        const msg_wrapper = document.createElement('div')
        msg_wrapper.className =
            'msg_wrapper text-dark d-flex justify-content-end align-items-center p-2' +
            classN

        const p = document.createElement('p')
        p.className = 'm-0 p-2 my-2'
        p.textContent = `${message}`
        msg_wrapper.append(p)
        div.append(msg_wrapper)
        welcomeMessageElement.appendChild(div)
        var d = $('#chat-window')
        d.scrollTop(d.prop('scrollHeight'))
    }
}

const appendButton = (itemList, menu, msgPos = '') => {
    let buttonContainer = document.getElementById('button-container')

    // if its the first response
    if (msgPos == 'isFirst') {
        buttonContainer = document.getElementById(`order_list_buttons${tries}`)
    }

    // if its the menu response
    if (msgPos == 'menu') {
        buttonContainer = document.getElementById(`menu_btn_wrapper${tries}`)
    }

    buttonContainer.innerHTML = ''
    const handle = menu ? handleButtonClick : handleMenuButtonclick
    const buttons = itemList.map((item) => {
        const button = document.createElement('button')
        if (msgPos == 'isFirst') {
            button.classList.add('btn')
            button.classList.add('btn-outline-primary')
            button.classList.add('w-100')
            button.classList.add('mb-1')
        }

        if (msgPos == 'menu') {
            button.className =
                'menu_btn rounded bg-light border-0 m-1 outline-0 fw-400 btn-sm px-4 py-2'
        }

        button.setAttribute('id', item.key)
        button.innerHTML = item.value
        button.addEventListener('click', () => {
            disableButtons()
            handle(item)
        })

        buttonContainer.appendChild(button)
        return button
    })
}

const cardContainer = (list) => {
    const card = document.getElementById('chat-window')

    const orderHistoryCard = document.createElement('div')
    orderHistoryCard.classList.add('msg_wrapper')

    const orderHistoryHeader = document.createElement('div')
    orderHistoryHeader.innerHTML = `
        <h6 class="msg_wrapper_tsitle mt-1 fw-bold text-black">ORDER HISTORY</h6>`
    orderHistoryCard.appendChild(orderHistoryHeader)

    const orderlist = document.createElement('ul')
    orderlist.className = 'list-group'

    for (let order of list) {
        const orderItem = document.createElement('li')
        orderItem.className = 'list-group-item'
        orderItem.innerHTML = `<div>Item: ${
            order.itemname
        } </div> <div class='d-flex justify-content-end'> <small class='badge btn-sm ${
            order.status == 'completed'
                ? 'bg-success'
                : order.status == 'cancelled'
                ? 'bg-dark'
                : 'bg-danger'
        }'>${order.status}</small></div>`
        orderlist.appendChild(orderItem)
    }
    orderHistoryCard.appendChild(orderlist)

    card.appendChild(orderHistoryCard)
    const historyBackButton = document.createElement('div')
    historyBackButton.id = `historyback${tries}`
    orderHistoryCard.appendChild(historyBackButton)
}

const button = (text, object) => {
    const button = document.createElement('button')
    button.innerHTML = text
    button.addEventListener('click', () => {
        disableButtons()
        handleButtonClick(object)
    })
    return button
}

/* EVENT HANDLERS */
const handleButtonClick = (object) => {
    if (object.value == 'Back') tries = tries + 1
    socket.emit('request', { action: object.key })
}

const handleMenuButtonclick = (userRequest) => {
    socket.emit('order', userRequest)
}

/* EVENT EMITTERS */
socket.on('welcome', function (msg) {
    setTimeout(() => {
        notificationSound.play()
        appendMessage(true, msg, 'isFirst')
        appendButton(buttons, true, 'isFirst')
        scrollToBottom()
    }, 200)
})

socket.on('user_request', function (msg) {
    appendMessage(false, msg)
    scrollToBottom()
})

socket.on('bot_response', function (data) {
    setTimeout(() => {
        notificationSound.play()
        appendMessage(true, data.message, 'menu')
        appendButton(data.menu, false, 'menu')
        scrollToBottom()
    }, 500)
})

socket.on('cancel_response', function (msg) {
    setTimeout(() => {
        notificationSound.play()
        appendMessage(true, msg, 'notCompleted')
        // so whats going on here
        // we will be having more than one of this request, so we need to make the id of the button onctainer unique, scroll to line  unique
        let buttonContainer = document.querySelectorAll(`#notCompleted${tries}`)

        buttonContainer = buttonContainer[buttonContainer.length - 1]
        console.log(buttonContainer)
        buttonContainer.innerHTML = ''

        const button1 = button('Back', { key: '88', value: 'Back' })
        button1.className = 'btn btn-outline-dark w-100 mb-1'
        buttonContainer.appendChild(button1)
        scrollToBottom()
    }, 500)
})

socket.on('completed_response', function (msg) {
    setTimeout(() => {
        notificationSound.play()
        appendMessage(true, msg, 'completed')

        let buttonContainer = document.getElementById(
            `completed_button-container${tries}`
        )
        buttonContainer.innerHTML = ''
        const button1 = button('Back', { key: '88', value: 'Back' })
        button1.className = 'btn btn-outline-dark w-100 mb-1'
        buttonContainer.appendChild(button1)
        scrollToBottom()
    }, 500)
})

socket.on('history', function (data) {
    setTimeout(() => {
        notificationSound.play()
        cardContainer(data)

        let buttonContainer = document.getElementById(`historyback${tries}`)
        buttonContainer.innerHTML = ''

        const button1 = button('Back', { key: '88', value: 'Back' })
        const button2 = button('Place Order', { key: '1', value: 'Back' })

        button2.className = 'btn btn-outline-primary w-100 mb-1'
        button1.className = 'btn btn-outline-dark w-100 mb-1'

        buttonContainer.appendChild(button2)
        buttonContainer.appendChild(button1)
        scrollToBottom()
    }, 500)
})

socket.on('menu_response', function (msg) {
    setTimeout(() => {
        notificationSound.play()
        appendMessage(true, msg, 'menu_response')

        let buttonContainer = document.getElementById(
            `menu_response_btn_wrapper${tries}`
        )
        buttonContainer.innerHTML = ''

        const button1 = button('Checkout Order', {
            key: '99',
            value: 'Checkout Order',
        })
        const button2 = button('Cancel Order', {
            key: '0',
            value: 'Cancel Order',
        })
        const button3 = button('Back', { key: '88', value: 'Back' })
        button1.className = 'btn btn-outline-primary w-100 mb-1'
        button2.className = 'btn btn-outline-danger w-100 mb-1'
        button3.className = 'btn btn-outline-dark w-100 mb-1'

        if (msg.message.includes('placed any order yet')) {
            buttonContainer.appendChild(button3)
        } else {
            buttonContainer.appendChild(button1)
            buttonContainer.appendChild(button2)
            buttonContainer.appendChild(button3)
            scrollToBottom()
        }
    }, 500)
})

// when menu button is clicked
$('body').on('click', '.menu_btn', function (e) {
    $('.menu_btn').removeClass('active')
    $(this).addClass('active')
})
