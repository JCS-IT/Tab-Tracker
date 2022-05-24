cd ..
cd docker
docker-compose up -d
sleep 5s
firefox --kiosk http://localhost:5000
