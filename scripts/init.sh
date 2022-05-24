cd ..
cd docker
docker-compose up -d
sleep 7s
firefox --kiosk http://localhost:5000
