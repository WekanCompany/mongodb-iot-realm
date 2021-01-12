#!/bin/bash
set -x #echo on
docker buildx build -t wekancode123/realm-aedes-updater:$1 . --push --platform linux/arm/v7
