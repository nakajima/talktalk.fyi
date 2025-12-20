#!/bin/bash

cleanup() {
    echo "stopping..."
    tailscale serve reset
    kill $(jobs -p) 2>/dev/null
}

trap cleanup EXIT

echo "starting server"
python -m http.server 8000 &
sleep 1

echo "serving"
tailscale serve 8000 &
sleep 1

echo "watching"
watchexec --exts css,template,md,rs,js "(cd ./builder && cargo run > ../index.html)"