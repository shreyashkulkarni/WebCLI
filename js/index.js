'use strict'

var bleNUSserviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
var bleNUSrxUUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
var bleNUStxUUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
var MTU = 20;

var bleDevice;
var device;
var bleServer;
var nusService;
var rxCharacteristic;
var txCharacteristic;

var deviceName = 'APP Board 3.0(D1-B9)'

var connected = false;

function ToggleButton() {
    if (connected) {
        disconnect();
    } else {
        connect();
    }
    //document.getElementById('terminal').focus();
}

function setConnectButtonState(enabled) {
    if (enabled) {
        document.getElementById("clientConnectBtn").innerHTML = "Disconnect the BLE Device"
    } else {
        document.getElementById("clientConnectBtn").innerHTML = "Connect the BLE Device"
    }
}

function connect() {
    if (!navigator.bluetooth) {
        console.log('Web Bluetooth is not available!')
        return;
    }

    console.log('Requesting BLE device info...')
    let options = {
        // acceptAllDevices: true // Option to accept all devices
        "optionalServices": [bleNUSserviceUUID],
        "filters": [
            { "name": deviceName }
        ]
    }

    navigator.bluetooth.requestDevice(options)
        .then(device => {
            bleDevice = device;
            console.log('Found ' + device.name);
            console.log('Connecting to GATT server.....');
            //bleDevice.addEventListener('gattserverdisconnected', onDisconnected);
            return device.gatt.connect();
        })
        .then(server => {
            console.log('Locate NUS service');
            return server.getPrimaryService(bleNUSserviceUUID);
        })
        .then(service => {
            nusService = service;
            console.log('Found NUS service: ' + service.uuid);
        })
        .catch(error => {
            console.log('' + error);
            if (bleDevice && bleDevice.gatt.connected) {
                bleDevice.gatt.disconnect();
            }
        });
}


function disconnect() {
    if (!bleDevice) {
        console.log('No Bluetooth Device connected...');
        return;
    }
    console.log('Disconnecting from Bluetooth Device...');
    if (bleDevice.gatt.connected) {
        bleDevice.gatt.disconnect();
        connected = false;
        setConnectButtonState(false);
        console.log('Bluetooth Device connected: ' + bleDevice.gatt.connected);
    } else {
        console.log('> Bluetooth Device is already disconnected');
    }
}

/*
function getDeviceInfo() {
    let options = {
        //filters: [{....}],
        optionalServices: ['battery_service'],
        acceptAllDevices: true
    }

    console.log('Requesting BLE device info...')
    navigator.bluetooth.requestDevice(options)
        .then(device => {
            console.log('Name: ' + device.name)
        }).catch(error => {
            console.log('Request device error: ' + error)
        })
}


document.querySelector('form').addEventListener('submit',
    function(event) {
        event.setConnectButtonState()
    })

function initContent(io) {
    io.println("\r\n\
    Welcome to Web Device CLI V0.1.0 (03/19/2019)\r\n\
    Copyright (C) 2019  makerdiary.\r\n\
    \r\n\
    This is a Web Command Line Interface via NUS (Nordic UART Service) using Web Bluetooth.\r\n\
    \r\n\
      * Source: https://github.com/makerdiary/web-device-cli\r\n\
      * Live:   https://makerdiary.github.io/web-device-cli\r\n\
    ");
}*/