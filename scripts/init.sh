cd /docker/jcstab/docker && docker-compose up -d --force-recreate
sleep 1m
chromium-browser --kiosk http://localhost:5000
