#!/bin/bash

# Manual test to spool up the latest docker image, submit the raw body and print
# the actual result for human review.

docker run --rm -d -p 8080:80 --name mjml-server-test adrianrudnik/mjml-server:latest

sleep 5

curl --data "@raw.mjml" -H "Content-Type: text/html" http://localhost:8080
curl --data "@raw.mjml" -H "Content-Type: text/plain" http://localhost:8080
curl --data "@raw.mjml.json" -H "Content-Type: application/json" http://localhost:8080

docker stop mjml-server-test
