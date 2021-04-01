#!/bin/bash
set -x #echo on
docker buildx build -t wekancode123/realm-aedes-broker:$1 . --push
