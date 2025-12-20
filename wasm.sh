#!/bin/bash

pushd $HOME/apps/talk/wasm
npm run build
cargo build --release
cp -r pkg/ ../../talktalk.sh/pkg
popd