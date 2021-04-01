#!/bin/bash
set -x #echo on
docker buildx build -t wekancode123/realm-aedes-sensehat-client:$1 . --push
