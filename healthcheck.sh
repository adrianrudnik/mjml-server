#!/bin/sh

HOST=http://localhost:80/
TOKEN=RmVXY49YwsRfuBBfiYcWOpq6Py57pfa2x
RESULT=$(curl -s -f -X POST -H "Content-Type: text/plain" --data "<mjml><mj-body><mj-section><mj-column><mj-text>${TOKEN}</mj-text></mj-column></mj-section></mj-body></mjml>" ${HOST})

if [ $? -gt 0 ]; then
 exit 1
fi

if echo ${RESULT} | grep -q ${TOKEN}; then
 exit 0
else
 exit 1
fi
