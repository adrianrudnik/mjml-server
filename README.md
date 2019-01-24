# MJML docker microservice / server

Standalone mjml server, listening on port 80/tcp.

Due to various challenges this image sports the following features:

- Clean and fast shutdowns on docker.
- Simple port setup and CORS capabilities.
- Small footprint (at least in a npm way).

# Table of contents
- [Overview](#overview)
- [Troubleshooting](#troubleshooting)

## Overview

This image spools up a simple mjml server instance, listening to port 80/tcp per default.

Due to GDPR / DSGVO reasons I required the mjml instance to be under my own control, as the processing personal information is processed in mail content generation.

Starting the image is as easy as running a test instance through docker

```sh
docker run -it --rm -p 8889:80 mjml-server # --port 9999 --cors "*"
```

or `docker-compose` with the following example:

```yml
version: '3.7'

services:
  mjml:
    image: adrianrudnik/mjml-server
    # command: --port <port> --cors "*"
    ports:
      - 8889:80
```

## Troubleshooting

Make sure you pass along a plain Content-Type header and pass the mjml as raw body.

Catch errors by looking at the HTTP response code.
