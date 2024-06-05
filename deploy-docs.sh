#!/bin/bash

SRC_DIR="./docs/js-debeem-wallet"
DST_DIR="../debeem.github.io/docs/js-debeem-wallet"

if [ ! -d "$SRC_DIR" ]; then
  echo "The source folder does not exist. Exited."
  exit 1
fi

if [ -d "$DST_DIR" ]; then
  echo "The target folder already exists."
  echo "Trying to clean up the folder before overwriting it."
  rm -r "$DST_DIR"
  echo "Cleaned up"
fi

cp -r "$SRC_DIR" "$DST_DIR"
echo "Published"
