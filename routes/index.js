const express = require('express');
const {WebhookClient} = require("dialogflow-fulfillment");
const router = express.Router();
var auth = require('./authentification')

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

    function accountBalance(agent) {
        auth.authenticate(agent, () => agent.add(`Du hast kein Geld mehr`));
    }

    let intentMap = new Map();
    intentMap.set('Kontostand', accountBalance);
    return agent.handleRequest(intentMap);
});


module.exports = router;
