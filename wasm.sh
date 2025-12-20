#!/bin/bash

rm -rf pkg/
pushd $HOME/apps/talk/wasm
npm run build
cargo build --release
cp -r pkg/ ../../talktalk.sh/pkg
popd