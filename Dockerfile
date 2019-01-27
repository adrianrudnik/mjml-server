FROM node:alpine

COPY package* ./

RUN set -ex \
    && apk --no-cache upgrade \
    && apk --no-cache add curl \
    && npm install

COPY index.js ./index.js

COPY healthcheck.sh /healthcheck.sh

ENV CORS=""

HEALTHCHECK --timeout=2s \
  CMD /healthcheck.sh || exit 1

EXPOSE 80

ENTRYPOINT [ "node", "index.js"]
