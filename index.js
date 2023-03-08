#!/usr/bin/env node

'use strict'

const express = require('express'),
    bodyParser = require('body-parser'),
    os = require('os'),
    mjml2html = require('mjml'),
    program = require('commander')

const healthchecks = require('./healthcheck')

program.usage('[options]').parse(process.argv)

const app = express()

const maxReqBody = (process.env.MAX_REQUEST_BODY || '2048kb')
app
    .use(
        bodyParser.text({ limit: maxReqBody, type: 'text/*' }),
        bodyParser.json({ limit: maxReqBody })
    )

const opts = {
    keepComments: (process.env.MJML_KEEP_COMMENTS === 'true'),
    minify: (process.env.MJML_MINIFY === 'true'),
    beautify: (process.env.MJML_BEAUTIFY === 'true'),
    validationLevel: (['soft', 'strict', 'skip'].includes(process.env.MJML_VALIDATION_LEVEL) ? process.env.MJML_VALIDATION_LEVEL : 'soft'),
    healthchecks: (process.env.HEALTHCHECK === 'true')
}

const charsetOpts = {
    write: (process.env.CHARSET),
    contentType: (process.env.DEFAULT_RESPONSE_CONTENT_TYPE)
}

if (opts.healthchecks) {
    healthchecks.create(app, opts)
}

app.post('/', function (req, res) {
    // enable cors
    if (process.env.CORS) {
        res.header('Access-Control-Allow-Origin', process.env.CORS)
        res.header('Access-Control-Allow-Headers', '*')
        res.header('Access-Control-Allow-Methods', 'POST')
        res.header('Access-Control-Max-Age', '-1')
    }

    // ensure content type is set
    if (!req.headers['content-type']) {
        res.status(400).send('Content-Type must be set, use text/html or application/json if unsure')
        return
    }

    try {
        const input = req.body.mjml || req.body || '';
        const result = mjml2html(input, opts)
        const isJson = req.headers['content-type'] === 'application/json'
        return res.send(isJson ? { html: result.html } : result.html)
    } catch (ex) {
        // print error details
        console.log(req.body || '')
        console.error(ex)
        console.log('')

        res.writeHead(400, {'Content-Type': 'text/plain'})
        res.end(ex.message)
    }
})

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
console.log('maxReqBody: ' + maxReqBody)
console.log('healthchecks: ' + opts.healthchecks)
console.log('mjml keep comments: ' + opts.keepComments)
console.log('mjml validation level: ' + opts.validationLevel)
console.log('mjml minify: ' + opts.minify)
console.log('mjml beautify: ' + opts.beautify)
console.log('node default content-type:' + charsetOpts.contentType)
console.log('node write charset:' + charsetOpts.write)
console.log('')
console.log('POST mjml as application/json body, result will be returned as application/json.')
