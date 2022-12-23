#!/bin/bash
git pull

docker build . -t srizan10/ava

docker stop ava

docker rm ava

docker run -d -t --name ava --restart unless-stopped srizan10/ava