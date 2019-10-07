#!/bin/bash
LOG_FILE=/var/log/startup.log
echo "run startup script" >> "$LOG_FILE"
export CONFIG_ENV="production"
cd /opt/yeschef-be
echo "reset yeschef-be folder" >> "$LOG_FILE"
sudo git fetch origin
sudo git reset --hard origin/master
echo "update to recent code" >> "$LOG_FILE"
sudo git pull
sudo npm install

echo "check the pm2 process status" >> "$LOG_FILE"
isProcessExists=$(sudo pm2 list | grep yc-be | wc -l)
if [$isProcessExists = 0]; then
    echo "update the pm2" >> "$LOG_FILE"
    sudo pm2 update
else
    echo "create the pm2" >> "$LOG_FILE"
    sudo pm2 start/opt/yeschef-be/server.js --watch --name yc-be --max-memory-restart 500M -i max
fi