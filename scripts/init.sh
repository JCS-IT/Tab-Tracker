cd /docker/jcstab && docker-compose up -d --force-recreate
sleep 1m
chromium-browser --noerrdialogs --disable-infobars --start-fullscreen http://localhost:5000
