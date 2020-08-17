/*const mqtt = require('mqtt');
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

const topic = '/ttgray/test/hello/';
const msg = 'Hello MQTT world!';

client.on('connect', () => {
	console.log('connected');
	client.publish(topic, msg, () => {
		console.log('message sent...');
	});
});
*/

const mqtt = require('mqtt');
const express = require('express');
const mongoose = require('mongoose');
const randomCoordinates = require('random-coordinates');
const rand = require('random-int');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5001;
const Device = require('./models/device'); 

mongoose.connect('mongodb+srv://tgray:3Spudder6@cluster0.q7dbj.mongodb.net', { useNewUrlParser: true, useUnifiedTopology: true })

app.use(express.static('public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

client.on('connect', () => {
    console.log('mqtt connected');
    client.subscribe('/sensorData');
});

client.on('message', (topic, message) => {
    //console.log(`Received message on ${topic}: ${message}`);
    if (topic == '/sensorData') {
        //console.log(`Received message: ${message}`);
        const data = JSON.parse(message);
        //console.log(data);

        Device.findOne({"name": data.deviceId }, (err, device) => {
            if (err) {
                console.log(err)
            }
           
            const { sensorData } = device;
            const { ts, loc, temp } = data;

            sensorData.push({ ts, loc, temp });
            device.sensorData = sensorData;

            device.save(err => {
                if (err) {
                    console.log(err)
                }
            });
        });
    }
    
});

app.post('/send-command', (req, res) => {
    const { deviceID, command } = req.body;
    const topic = `/ttgray/command/${deviceID}`;
    client.publish(topic, command, () => {
        res.send('published new message');
    });
});

/**
* @api {put} /sensor-data Device sensor data
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
* {
*   "message published
* }
* @apiErrorExample {json} Error-Response:
* {
* "No device"
* }
*/

app.put('/sensor-data', (req, res) => {
    const { deviceId } = req.body;

    const [lat, lon] = randomCoordinates().split(", ");
    const ts = new Date().getTime();
    const loc = { lat, lon };
    const temp = rand(20, 50);

    const topic = `/sensorData`;
    const message = JSON.stringify({ deviceId, ts, loc, temp });

    client.publish(topic, message, () => {
        res.send('published new message');
    });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});