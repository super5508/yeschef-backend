#!/bin/bash
export CONFIG_ENV = "production"
cd /opt/yeschef-be
sudo git fetch origin
sudo git reset--hard origin / master
sudo git pull
sudo npm install

isProcessExists = $(sudo pm2 list | grep yc-be | wc -l)
if [$isProcessExists = 0]; then
    sudo pm2 update
else
    sudo pm2 start/opt/yeschef-be/server.js --watch --name yc-be --max-memory-restart 500M -i max
fi