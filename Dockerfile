FROM node:alpine

COPY package* ./

RUN set -ex \
    && npm install

COPY index.js ./index.js

EXPOSE 80

ENTRYPOINT [ "node", "index.js" ]
