let connectButton = document.getElementById('ConnectBtn');
let disconnectButton = document.getElementById('DisConnectBtn');
let sendForm = document.getElementById('send-form');
let terminalContainer = document.getElementById('terminal');
let inputField = document.getElementById('input');

// Connect to the device on Connect button click
connectButton.addEventListener('click', function() {
    connect();
});

// Disconnect from the device on Disconnect button click
disconnectButton.addEventListener('click', function() {
    disconnect();
})

// Handle form submit event
sendForm.addEventListener('submit', function(event) {
    event.preventDefault();
    send(inputField.value);
    inputField.value = '';
    inputField.focus();
})