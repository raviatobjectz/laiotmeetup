//Variables that nees setting

var variables = require('./variables');

var rootFolder = variables.rootFolder;
var certsFolder = variables.certsFolder;
var deviceID = variables.deviceID;
var awsRegion = variables.awsRegion;
var sensorTopic = variables.sensorTopic;
var buzzerTopic = variables.buzzerTopic;
var thingName = variables.thingName;


var ip = require("ip");
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const eventEmitter = new MyEmitter();
var awsIot = require('aws-iot-device-sdk');
var device = awsIot.device({
   keyPath: certsFolder+"/private.pem",
   certPath: certsFolder+"/certificate.crt",
   caPath: certsFolder+"/root-CA.crt",
   clientId: deviceID,
   region: awsRegion
});

var currentShadow = {
  "state": {
    "desired": {
      "TEMPERATURE": 0,
      "LIGHT": 0,
      "TOUCH": 0
    },
    "reported": {
      "TEMPERATURE": 0,
      "LIGHT": 0,
      "TOUCH": 0
    }
  }
};

device.on('connect', function() {
    console.log('connect');
    device.subscribe(buzzerTopic);
    eventEmitter.emit('awsIOTInitialized');
    setInterval( function() {
      device.publish('$aws/things/'+thingName+'/shadow/update', JSON.stringify(currentShadow));
    }, 5000 );


});

device.on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
    if (topic == buzzerTopic && payload.toString() == 'buzzeron') {
        console.log('Buzzer goes on');
        buzzerOutput.write(1);
    }
    if (topic == buzzerTopic && payload.toString() == 'buzzeroff') {
        console.log('Buzzer goes off');
        buzzerOutput.write(0);
    }

});

var GrovePi = require('node-grovepi').GrovePi
var Commands = GrovePi.commands
var Board = GrovePi.board
var lightSensor = null;
var tempSensor = null;
var touchSensor = null;
var buzzerOutput = null;
var board = null;

eventEmitter.on('awsIOTInitialized', function() {
  board = new Board({
      debug: true,
      onError: function(err) {
        console.log('Something wrong just happened');
        console.log(err);
      },
      onInit: function(res) {
        if (res) {
          console.log('GrovePi Version :: ' + board.version());
          board.pinMode(8,board.OUTPUT);
          lightSensor = new GrovePi.sensors.LightAnalog(0);
          tempSensor = new GrovePi.sensors.TemperatureAnalog(1);
          touchSensor = new GrovePi.sensors.base.Digital(3);
          buzzerOutput = new GrovePi.sensors.base.Digital(8);
          lightSensor.stream(5000, lightSensorCallback);
          tempSensor.stream(5000, tempSensorCallback);
          touchSensor.on('change', touchSensorCallback)
          touchSensor.watch();
        }
      }
  });
  board.init();
});

function lightSensorCallback(value) {
   if (value > 0) {
       var messagePayload = {
          "DEVICEID" : deviceID,
          "TIMESTAMP" : Number(new Date()).toString(),
          "SENSOR" : "LIGHT",
          "VALUE" : Math.round(value),
          "MYIP" : ip.address()
       };
       currentShadow.state.desired.LIGHT = Math.round(value);
       currentShadow.state.reported.LIGHT = Math.round(value);
       device.publish(sensorTopic+'/LIGHT', JSON.stringify(messagePayload));
   }
}

function tempSensorCallback(value) {
   if (value > 0) {
      var messagePayload = {
         "DEVICEID" : deviceID,
         "TIMESTAMP" : Number(new Date()).toString(),
         "SENSOR" : "TEMPERATURE",
         "VALUE" : Math.round(value),
         "MYIP" : ip.address()
      };
      currentShadow.state.desired.TEMPERATURE = Math.round(value);
      currentShadow.state.reported.TEMPERATURE = Math.round(value);
      device.publish(sensorTopic+'/TEMPERATURE', JSON.stringify(messagePayload));
   }
}

function touchSensorCallback(value) {
      var messagePayload = {
         "DEVICEID" : deviceID,
         "TIMESTAMP" : Number(new Date()).toString(),
         "SENSOR" : "TOUCH",
         "VALUE" : value,
         "MYIP" : ip.address()
      };
      currentShadow.state.desired.TOUCH = value;
      currentShadow.state.reported.TOUCH = value;
      device.publish(sensorTopic+'/TOUCH', JSON.stringify(messagePayload));
}
