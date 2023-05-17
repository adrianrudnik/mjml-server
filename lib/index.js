#!/usr/bin/env node

'use strict'

require('newrelic');

const os = require("os")
const { app } = require("./app")

const charsetOpts = {
    write: (process.env.CHARSET),
    contentType: (process.env.DEFAULT_RESPONSE_CONTENT_TYPE)
}

const server = app.listen(process.env.PORT || 80)

const signals = {
    'SIGHUP': 1,
    'SIGINT': 2,
    'SIGTERM': 15,
}

const shutdown = (signal, value) => {
    server.close(() => {
        console.log(`app stopped by ${signal} with value ${value}`)
        process.exit(128 + value)
    })
}

Object.keys(signals).forEach((signal) => {
    process.on(signal, () => {
        console.log(`process received a ${signal} signal`)
        shutdown(signal, signals[signal])
    })
})

console.log('self: ' + os.hostname() + ':' + server.address().port)
console.log('cors: ' + (process.env.CORS || 'n/a'))
console.log('node default content-type:' + charsetOpts.contentType)
console.log('node write charset:' + charsetOpts.write)
console.log('')
console.log('POST mjml as application/json body, result will be returned as application/json.')