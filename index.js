const mqtt = require("mqtt")
const fs = require("fs")
const readline = require("readline")

var file = '/home-assistant/cputemps/latesttemps.log' // This is the path to the file where the 'sensors' Output is redirected to
var rl = readline.createInterface({
	input: fs.createReadStream(file),
	output: process.stdout,
	terminal: false
});

var object = {
	core0temperature: 0,
	core1temperature: 1,
	core2temperature: 2,
	core3temperature: 3,
	avgcoretemperature: 1.3,
	peakcoretemperature: 3
}

rl.on('line', function(line) {
	if (line.startsWith("Core"))
	{
		var parts = line.split(' ')
		while (!parts[0].startsWith('+'))
		{
			parts.shift();
		}
		var tempstring = parts[0];
		tempstring = tempstring.substring(1);
		tempstring = tempstring.substring(0, tempstring.length - 2)
		if (line.startsWith("Core 0"))
			object.core0temperature = Number(tempstring)
		if (line.startsWith("Core 1"))
			object.core1temperature = Number(tempstring)
		if (line.startsWith("Core 2"))
			object.core2temperature = Number(tempstring)
		if (line.startsWith("Core 3"))
		{
			object.core3temperature = Number(tempstring)
			object.avgcoretemperature = 0.25 * (object.core0temperature + object.core1temperature + object.core2temperature + object.core3temperature)

			object.peakcoretemperature = object.core0temperature;
			if (object.core1temperature > object.peakcoretemperature)
				object.peakcoretemperature = object.core1temperature
			if (object.core2temperature > object.peakcoretemperature)
				object.peakcoretemperature = object.core2temperature
			if (object.core3temperature > object.peakcoretemperature)
				object.peakcoretemperature = object.core3temperature

			var mqttclient = mqtt.connect("<MQTT-Broker Address>") // Put your MQTT-Brokers Address here
			mqttclient.on('connect', function () {
				mqttclient.publish("sensors/cputemps", JSON.stringify(object)) // If you change the topic here, remember to change it in your configuration.yaml
				console.log(JSON.stringify(object))
				mqttclient.end()
			})
		}
	}
});

