var router = require('express').Router();
var four0four = require('./utils/404')();
var data = require('./data');
var dns = require('native-dns');
var util = require('util');

router.get('/people', getPeople);
router.get('/person/:id', getPerson);

router.post('/records', getRecords);

router.get('/*', four0four.notFoundMiddleware);

module.exports = router;

//////////////

function getPeople(req, res, next) {
    res.status(200).send(data.people);
}

function getPerson(req, res, next) {
    var id = +req.params.id;
    var person = data.people.filter(function(p) {
        return p.id === id;
    })[0];

    if (person) {
        res.status(200).send(person);
    } else {
        four0four.send404(req, res, 'person ' + id + ' not found');
    }
}

function getRecords(req, res, next) {
    var domains = req.body.domains;
    var records = req.body.records;
    var start = Date.now();

    console.log('  -- WTF IS UP');
    console.log(records, domains);

    /* TODO:
        Figure out how to queue and buffer
        multiple DNS requests!
        https://github.com/tjfontaine/node-dns/issues/105

        maybe:
        http://www.ainixon.me/when-and-how-to-use-async-in-node-js/
    */

    var questions = [];
    var dnsReq = dns.Request({
        question: dns.Question({
            name: 'www.google.com',
            type: 'A'
        }),
        server: {address: '8.8.8.8', port: 53, type: 'udp'},
        timeout: 1000
    });
    dnsReq.send();
/*
    domains.forEach(function(value, index, array){
        var dnsReq = dns.Request({
            question: dns.Question({
                name: value,
                type: 'A'
            }),
            server: {address: '8.8.8.8', port: 53, type: 'udp'},
            timeout: 1000
        });

        dnsReq.send();
    });
*/
    dnsReq.on('timeout', function () {
        console.log('Timeout in making request');
    });

    dnsReq.on('message', function (err, answer) {
        answer.answer.forEach(function (a) {
            console.log(a.address);
        });
    });

    dnsReq.on('end', function () {
        var delta = (Date.now()) - start;
        console.log(' -- WTF2: ');
        console.log('Finished processing request: ' + delta.toString() + 'ms');
    });

    res.status(200).send(data.records);
}

