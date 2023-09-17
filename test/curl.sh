#!/bin/bash

# Manual test to spool up the latest docker image, submit the raw body and print
# the actual result for human review.

docker run --rm -p 8080:80 -e "CORS=*" --name mjml-server-test adrianrudnik/mjml-server:latest

sleep 5

curl -v -H 'Content-Type: text/plain' --data "@raw.mjml" http://localhost:8080

docker stop mjml-server-test

# Alternative
# MJML_MINIFY=true MJML_BEAUTIFY=true PORT=8080 node index.js
