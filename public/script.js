const socket = io("ws://localhost:5000");

socket.on("connected", function (msg) {
  console.log("Customer connected");
});
