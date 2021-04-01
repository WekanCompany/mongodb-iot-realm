#!/bin/bash
set -x #echo on
docker buildx build -t wekancode123/realm-aedes-updater:$1 . --push
