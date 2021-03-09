const express = require('express');
const {WebhookClient} = require("dialogflow-fulfillment");
const router = express.Router();
const auth = require('./authentification')
const startVoicePrint = require("../intents/voiceprint");

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
        auth.authenticate(agent, () => agent.add(`Du hast kein Geld mehr`));
    }

    function voicePrint(agent) {
        startVoicePrint(agent);
    }

    let intentMap = new Map();
    intentMap.set('Kontostand', accountBalance);
    intentMap.set('Kontostand - Code', accountBalance);
    return agent.handleRequest(intentMap);
});


module.exports = router;
