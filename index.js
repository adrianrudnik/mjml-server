#!/usr/bin/env node

'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    os = require('os'),
    mjml2html = require('mjml'),
    program = require('commander');

program.version('1.0.0')
    .usage('[options]')
    .option('-c, --cors <origin>', 'enable cors header with given origin rule', process.env.CORS)
    .parse(process.argv);

var app = express();

var opts = {
    inflate: true,
    limit: '2048kb',
    type: '*/*'
};

app.use(bodyParser.text(opts));

app.all('*', function (req, res) {
    // enable cors
    if (program.cors) {
        res.header("Access-Control-Allow-Origin", program.cors);
        res.header("Access-Control-Allow-Headers", "*");
        res.header("Access-Control-Allow-Methods", "POST");
        res.header("Access-Control-Max-Age", "-1");
    }

    // ensure content type is set
    if (!req.headers['content-type']) {
        res.status(500).send('Content-Type must be set, use text/plain if unsure');
        return;
    }
    
    try {
        var result = mjml2html(req.body || '');
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(result.html);
    } catch (ex) {
        console.error(ex);
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end(ex);
    }
});

const server = app.listen(80);

var signals = {
  'SIGHUP': 1,
  'SIGINT': 2,
  'SIGTERM': 15
};

const shutdown = (signal, value) => {
  server.close(() => {
    console.log(`app stopped by ${signal} with value ${value}`);
    process.exit(128 + value);
  });
};

Object.keys(signals).forEach((signal) => {
  process.on(signal, () => {
    console.log(`process received a ${signal} signal`);
    shutdown(signal, signals[signal]);
  });
});

console.log('self: ' + os.hostname() + ':' + program.port)
console.log('cors: ' + program.cors)
console.log('POST mjml as text/plain raw body, result will be returned as text/plain.');
