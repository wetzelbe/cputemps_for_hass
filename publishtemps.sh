#!/bin/bash
sensors > /home-assistant/cputemps/latesttemps.log
node  /home-assistant/cputemps/index.js > /home-assistant/cputemps/node.log
