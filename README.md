# Adding CPU Temperatures to the Home Assistant
You can use this code and Documentation to add your CPU Core Temperatures to the Home Assistant using MQTT.
The system has been tested on Ubuntu Desktop 20.04 running on a ASUS N3050I-C Board. It uses the sensors command which can be installed using apt.
It also requires node and npm.
Right now the number of cores is hardcoded, you will have to adapt the code to fit your configuration.
You will also have to adapt all paths, depending on where you want to store the code. 
## Reading Temperatures
The temperatures are read by redirecting the 'sensors' command's output to a file.
The NodeJS-Script then reads the file and parses all lines which contain core temperatures.

## Publishing Data
When the temperatures have been parsed they are published on a MQTT-Broker.
Also a average temperature is calculated and the highest of the core temperatures will be published aswell.

## Configuring the Home-Assistant

The following yaml is the configuration at the Home-Assistant. You can put in the address of your MQTT-Broker and paste it in your configuration.yaml.

    mqtt:
     broker: <BROKER ADDRESS>
     port: 1883
     client_id: "hass"
    sensor:
     - platform: mqtt
       name: "Core 0 Temperature"
       state_topic: "sensors/cputemps"
       unit_of_measurement: '°C'
       value_template: "{{ value_json.core0temperature }}"
     - platform: mqtt
       name: "Core 1 Temperature"
       state_topic: "sensors/cputemps"
       unit_of_measurement: '°C'
       value_template: "{{ value_json.core1temperature }}"
     - platform: mqtt
       name: "Core 2 Temperature"
       state_topic: "sensors/cputemps"
       unit_of_measurement: '°C'
       value_template: "{{ value_json.core2temperature }}"
     - platform: mqtt
       name: "Core 3 Temperature"
       state_topic: "sensors/cputemps"
       unit_of_measurement: '°C'
       value_template: "{{ value_json.core3temperature }}"
     - platform: mqtt
       name: "Average Core Temperature"
       state_topic: "sensors/cputemps"
       unit_of_measurement: '°C'
       value_template: "{{ value_json.avgcoretemperature }}"
     - platform: mqtt
       name: "Highest Core Temperature"
       state_topic: "sensors/cputemps"
       unit_of_measurement: '°C'
       value_template: "{{ value_json.peakcoretemperature }}"
  
  
  ## Running the Bash-Script in a CRON-Job
  You might have to run the CRON-Job as root. In that case add it to 'sudo crontab -e'.
  > */5 * * * * /home-assistant/cputemps/publishtemps.sh  
  
