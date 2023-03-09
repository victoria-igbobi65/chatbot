const socket = io("ws://localhost:5000");

socket.on("welcome", function (msg) {
  console.log(msg);
  const welcomeMessageElement = document.getElementById('welcome')
  const p = document.createElement('p')
  p.textContent = `${msg}`
  welcomeMessageElement.append(p)
});


orderButton.addEventListener('click', function(e){
    socket.emit()
})