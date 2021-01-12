#!/bin/bash
set -x #echo on
docker run \
  --restart unless-stopped \
  --device /dev/fb0 \
  --device /dev/fb1 \
  --publish 1883:1883 \
  --publish 3000:3000 \
  --env-file ./configuration/broker.env \
  --network realm-aedes-net \
  --detach \
  --name broker wekancode123/realm-aedes-broker:$1
