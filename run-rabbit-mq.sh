#!/bin/sh

docker run -d --hostname my-rabbit \
--name some-rabbit -p 5674:5672 \
-v $PWD/rabbitmq-data:/var/lib/rabbitmq \
rabbitmq:3
