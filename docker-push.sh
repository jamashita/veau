#!/bin/bash

version=$1

version=$1

if [[ $# -eq 0 ]]; then
  version='latest'
fi

docker tag veau gcr.io/veau-229916/veau:${version}
docker push gcr.io/veau-229916/veau:${version}
