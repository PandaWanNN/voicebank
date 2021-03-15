const express = require('express');
const {WebhookClient} = require("dialogflow-fulfillment");
const router = express.Router();
const auth = require('./authentification')

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
    return agent.handleRequest(intentMap);
});


module.exports = router;
