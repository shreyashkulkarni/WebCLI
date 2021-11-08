'use strict'

var nusService;
var rxCharacteristic;
var txCharacteristic;

var device;
let deviceCache = null;
let characteristicCache = null;

let deviceName = 'APP Board 3.0(D1-B9)'

let bleNUSserviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
let bleNUSrxUUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
let bleNUStxUUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

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

// Connect to the BLE device
function connect() {
    if (!navigator.bluetooth) {
        console.log('Web Bluetooth is not available!')
        return;
    }

    return (deviceCache ? Promise.resolve(deviceCache) : requestBluetoothDevice())
        .then(device => connectDeviceAndCacheCharateristic(device))
        .then(characterstic => startNotifications(characterstic))
        .catch(error => console.log(error.message));
}

function requestBluetoothDevice() {
    console.log('Requesting BLE device....');

    return navigator.bluetooth.requestDevice({
            "optionalServices": [bleNUSserviceUUID],
            "filters": [
                { "name": deviceName }
            ]
        })
        .then(device => {
            console.log('"' + device.name + '" bluetooth device selected');
            deviceCache = device;

            deviceCache.addEventListener('gattserverdisconnected', handleDisconnection);

            return deviceCache;
        });
}

// Connect to the device specified and get service, characteristic
function connectDeviceAndCacheCharateristic(device) {
    if (device.gatt.connected && characteristicCache) {
        return Promise.resolve(characteristicCache);
    }

    console.log('Connecting to GATT service......')
    return device.gatt.connect()
        .then(server => {
            console.log('GATT server connected, getting NUS service......');
            return server.getPrimaryService(bleNUSserviceUUID);

        })
        .then(service => {
            nusService = service;
            console.log('NUS Service found: ' + service.uuid);
        })
        .then(() => {
            console.log('Locate RX characteristic');
            return nusService.getCharacteristic(bleNUSrxUUID);
        })
        .then(characteristic => {
            rxCharacteristic = characteristic;
            console.log('Found RX characteristic');
            return rxCharacteristic;
        })
        .then(() => {
            console.log('Locate TX characteristic');
            return nusService.getCharacteristic(bleNUStxUUID);
        })
        .then(characteristic => {
            txCharacteristic = characteristic;
            console.log('Found TX characteristic');
        });
}

// Enable the characteristic changes notification
function startNotifications() {
    console.log('Starting Notifications....')
    return txCharacteristic.startNotifications()
        .then(() => {
            console.log('Notifications started');
        })
}

/*
function log(data, type = '') {
    terminalContainer.insertAdjacentHTML('beforeend',
        '<div' + (type ? ' class="' + type + '"' : '') + '>' + data + '</div>');
}*/


function handleDisconnection(event) {
    let device = event.target;
    console.log('"' + device.name + '" bluetooth device disconnected, trying to reconnect...');

    connectDeviceAndCacheCharateristic(device)
        .then(characteristic => startNotifications(characteristic))
        .catch(error => console.log(error.message))
}
// Disconnect from the connected device
function disconnect() {

}

// Send data to the connected device
function send(data) {

}