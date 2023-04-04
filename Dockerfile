FROM node:18-alpine3.16

ENV NODE_ENV=production

ENV CORS=""
ENV PORT=8080

ENV MAX_REQUEST_BODY="2048kb"
ENV MJML_KEEP_COMMENTS=false
ENV MJML_VALIDATION_LEVEL=soft
ENV MJML_BEAUTIFY=false
ENV HEALTHCHECK=true
ENV CHARSET="utf8"
ENV DEFAULT_RESPONSE_CONTENT_TYPE="text/html; charset=utf-8"

WORKDIR /app

COPY package* ./

RUN set -ex \
    && apk --no-cache upgrade \
    && apk --no-cache add curl ca-certificates \
    && update-ca-certificates \
    && npm install --ignore-scripts

COPY *.js ./

USER node
EXPOSE 8080

ENTRYPOINT [ "node", "index.js" ]
