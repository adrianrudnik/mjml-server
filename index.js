#!/usr/bin/env node

'use strict'

const express = require('express'),
  bodyParser = require('body-parser'),
  os = require('os'),
  mjml2html = require('mjml'),
  program = require('commander')

program.usage('[options]').parse(process.argv)

const app = express()

app.use(bodyParser.text({
  inflate: true,
  limit: '2048kb',
  type: '*/*',
}))

const opts = {
  keepComments: (process.env.MJML_KEEP_COMMENTS === 'true'),
  minify: (process.env.MJML_MINIFY === 'true'),
  validationLevel: (['soft', 'strict', 'skip'].includes(process.env.MJML_VALIDATION_LEVEL) ? process.env.MJML_VALIDATION_LEVEL : 'soft'),
}

app.all('*', function (req, res) {
  // enable cors
  if (process.env.CORS) {
    res.header('Access-Control-Allow-Origin', process.env.CORS)
    res.header('Access-Control-Allow-Headers', '*')
    res.header('Access-Control-Allow-Methods', 'POST')
    res.header('Access-Control-Max-Age', '-1')
  }

  // ensure content type is set
  if (!req.headers['content-type']) {
    res.status(500).send('Content-Type must be set, use text/plain if unsure')
    return
  }

  try {
    const result = mjml2html(req.body || '', opts)
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(result.html)
  } catch (ex) {
    // print error details
    console.log(req.body || '')
    console.error(ex)
    console.log('')

    res.writeHead(400, { 'Content-Type': 'text/plain' })
    res.end()
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
console.log('mjml keep comments: ' + opts.keepComments)
console.log('mjml validation level: ' + opts.validationLevel)
console.log('mjml minify: ' + opts.minify)
console.log('')
console.log('POST mjml as text/plain raw body, result will be returned as text/html.')
