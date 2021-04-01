#!/bin/bash
set -x #echo on
docker run \
  --restart unless-stopped \
  --env-file ./configuration/client.env \
  --network realm-aedes-net \
  --device /dev/i2c-1 \
  --detach \
  --name sensehat-client wekancode123/realm-aedes-sensehat-client:$1