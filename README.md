# MJML docker microservice / server

Standalone mjml server, listening on port 80/tcp.

Due to various challenges this image sports the following features:

- Clean and fast shutdowns on docker.
- Simple CORS capabilities.
- Small footprint (at least in a npm way).
- Supports healthchecks.

# Table of contents
- [MJML docker microservice / server](#mjml-docker-microservice--server)
- [Table of contents](#table-of-contents)
  - [Overview](#overview)
  - [Troubleshooting](#troubleshooting)

## Overview

This image spools up a simple mjml server instance, listening to port 80/tcp per default.

Due to GDPR / DSGVO reasons I required the mjml instance to be under my own control, as the processing personal information is processed in mail content generation.

Starting the image is as easy as running a test instance through docker

```sh
docker run -it --rm -p 8889:80 mjml-server # --cors "*"
```

or `docker-compose` with the following example:

```yml
version: '3.7'

services:
  mjml:
    image: adrianrudnik/mjml-server
    ports:
      - 8889:80
    # environment:
    #   CORS: *
```

## Troubleshooting

Make sure you pass along a plain Content-Type header and pass the mjml as raw body.

Catch errors by looking at the HTTP response code.
