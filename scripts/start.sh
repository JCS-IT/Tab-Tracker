crond -f -L /dev/stdout &
firebase emulators:start --import=/config/firestore/export --export-on-exit