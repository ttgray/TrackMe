const mqtt = require('mqtt');
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

const topic = '/ttgray/test/hello/';
const msg = 'Hello MQTT world!';

client.on('connect', () => {
	console.log('connected');
	client.publish(topic, msg, () => {
		console.log('message sent...');
	});
});

