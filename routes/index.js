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


const invoices = new Map();
invoices.set(1, "Swisscom");
invoices.set(2, "Swica");
invoices.set(3, "Stadwerke");

router.post('/dialogflow', function (request, response, next) {
    const agent = new WebhookClient({request, response});
    console.log("intent: " + agent.intent);

    function accountBalance(agent) {
        auth.authenticate(agent, () => agent.add(`Ihr Kontostand beträgt CHF 17536.90`));
    }

    function payment(agent) {
        let invoiceNumber = agent.parameters["ordinal"];

        function successMessage(companyName) {
            agent.add("Die Rechnung von: " + companyName + " wurde in Auftrag gegeben");
        }

        if (invoiceNumber !== undefined && invoiceNumber.length !== 0) {
            console.log(invoiceNumber);
            let companyName = invoices.get(invoiceNumber);
            successMessage(companyName);
        } else {
            agent.add(
                "Ich habe Sie nicht verstanden. Bitte wiederholen Sie nochmals welche Rechnung Sie bezahlen möchten");
        }

    }

    let intentMap = new Map();
    intentMap.set('Kontostand', accountBalance);
    intentMap.set('Kontostand - Code', accountBalance);
    intentMap.set('Kontostand - VoiceCode', accountBalance);
    intentMap.set('Payment - Answer', payment);
    return agent.handleRequest(intentMap);
});


module.exports = router;
