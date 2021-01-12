#!/bin/bash
set -x #echo on
docker run \
  --restart unless-stopped \
  --publish 9000:9000 \
  --env-file ./configuration/updater.env \
  --network realm-aedes-net \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  --detach \
  --name updater wekancode123/realm-aedes-updater:$1
