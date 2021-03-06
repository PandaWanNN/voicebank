const express = require('express');
const {WebhookClient} = require("dialogflow-fulfillment");
const router = express.Router();
const auth = require('./authentification')
const {paymentNo} = require("./payment");
const {paymentYes} = require("./payment");
const {payment} = require("./payment");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/test', function (req, res, next) {
    let hallo = "hallo";
    res.send(hallo);
});

router.post('/dialogflow', function (request, response, next) {
    const agent = new WebhookClient({request, response});
    console.log("intent: " + agent.intent);

    function accountBalance(agent) {
        auth.authenticate(agent, () => agent.add(`Ihr Kontostand beträgt CHF 17536.90`));
    }
    let intentMap = new Map();
    intentMap.set('Kontostand', accountBalance);
    intentMap.set('Kontostand - Code', accountBalance);
    intentMap.set('Kontostand - VoiceCode', accountBalance);
    intentMap.set('Payment', payment);
    intentMap.set('Payment - code', payment);
    intentMap.set('Payment - yes', paymentYes);
    intentMap.set('Payment - no', paymentNo);
    intentMap.set('Pin config', auth.pinConfig);
    return agent.handleRequest(intentMap);
});


module.exports = router;
