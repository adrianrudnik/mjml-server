# MJML docker microservice / server

Standalone mjml server, listening on port 80/tcp.

Due to various challenges this image sports the following features:

- Clean and fast shutdowns on docker.
- Simple CORS capabilities.
- Small footprint (at least in a npm way).
- Supports healthchecks.

# Table of contents
- [Overview](#overview)
- [Defaults](#defaults)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

## Overview

This image spools up a simple mjml server instance, listening to port 80/tcp per default.

Due to GDPR / DSGVO reasons I required the mjml instance to be under my own control, as the processing personal information is processed in mail content generation.

Starting the image is as easy as running a test instance through docker

```sh
docker run -it --rm -p 8889:80 mjml-server
```

or `docker-compose` with the following example:

```yml
version: '3.7'

services:
  mjml:
    image: adrianrudnik/mjml-server
    ports:
      - 8889:80
    # for development, uncomment the following lines:
    # environment:
    #   CORS: *
    #   MJML_KEEP_COMMENTS=true
    #   MJML_VALIDATION_LEVEL=strict
    #   MJML_MINIFY=false
```

## Defaults

The production defaults, without any override, default to:

```sh
CORS ""
MJML_KEEP_COMMENTS "false"
MJML_VALIDATION_LEVEL "soft"
MJML_MINIFY "true"
```

## Development

For development environments I would suggest to switch it to

```sh
CORS "*"
MJML_KEEP_COMMENTS "true"
MJML_VALIDATION_LEVEL "strict"
MJML_MINIFY "false"
```

This will escalate any issues you have with invalid mjml code to the docker log (`stdout` or `docker-compose logs`).

## Troubleshooting

Make sure you pass along a plain Content-Type header and pass the mjml as raw body.

Catch errors by looking at the HTTP response code.
