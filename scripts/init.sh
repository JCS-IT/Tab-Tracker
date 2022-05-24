cd ..
nohup firebase emulators:start --import=../firestore --export-on-exit &
sleep 5s
firefox --kiosk http://localhost:5000
