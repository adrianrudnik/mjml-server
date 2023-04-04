# MJML docker microservice / server

Standalone mjml server, listening on port 8080/tcp.

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
    - [Kubernetes](#kubernetes)

## Overview

This image spools up a simple mjml server instance, listening to port 8080/tcp per default.

Due to GDPR / DSGVO reasons I required the mjml instance to be under my own control, as the processing personal information is processed in mail content generation.

Starting the image is as easy as running a test instance through docker

```sh
docker-compose up
cd test
curl --data "@raw.mjml" http://localhost:8080
```


## Defaults

The production defaults, without any override, default to:

```sh
CORS=""
MAX_REQUEST_BODY="2048kb"
MJML_KEEP_COMMENTS="false"
MJML_VALIDATION_LEVEL="soft"
MJML_BEAUTIFY="false"
HEALTHCHECK="true"
CHARSET="utf8"
DEFAULT_RESPONSE_CONTENT_TYPE="text/html; charset=utf-8"
```

## Development

For development environments I would suggest to switch it to

```sh
CORS="*"
MJML_KEEP_COMMENTS="true"
MJML_VALIDATION_LEVEL="strict"
MJML_BEAUTIFY="false"
HEALTHCHECK="false"
```

This will escalate any issues you have with invalid mjml code to the docker log (`stdout` or `docker-compose logs`).

## Troubleshooting

Make sure you pass along a plain Content-Type header and pass the mjml as raw body.

Catch errors by looking at the HTTP response code.

### Kubernetes

As the default Dockerfile specific `HEALTHCHECK` directive is not supported by kubernetes, you might need to specify your own probes:

```
spec:
  containers:
  - name: ...
    livenessProbe:
      exec:
        command:
        - curl - 'http://localhost:8080/health/liveness'
      initialDelaySeconds: 30
      periodSeconds: 30
    readinessProbe:
      exec:
        command:
        - curl - 'http://localhost:8080/health/readiness'
      initialDelaySeconds: 25
```

### Docker

If you want to rely on the Makefile or build for multiple architectures, ensure you have the experimental features activated for Docker and you can use [docker buildx](https://docs.docker.com/buildx/working-with-buildx/).

Setup on my Ubuntu 20.04 workstation was as follows, based on the docs mentioned above:

```bash
# Install additional platforms for the default node on the current host linux os
docker run --privileged --rm tonistiigi/binfmt --install all

# create a separate endpoint that uses the default node
docker buildx create --use mjml-server default

# After that a local build should be possible with something like
docker buildx build -f Dockerfile --platform linux/amd64,linux/arm64 -t [registry-and-tag] --push .

# ... or if you want to use it locally with the mjml-server tag
docker buildx build -f Dockerfile --platform linux/amd64,linux/arm64 -t mjml-server --load .
```
