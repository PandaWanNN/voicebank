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
invoices.set(1, "Strom & Wasser AG, fällig am 2. Juni 2021, über CHF 421.75");
invoices.set(2, "Kreditkarten AG, fällig am 2. Mai 2021, über CHF 1598.10");
invoices.set(3, "Krankenkasse AG, fällig am 31. Mai 2021, über CHF 345.50");
invoices.set(4, "Handy AG, fällig am 15. Mai 2021, über CHF 35.50");

router.post('/dialogflow', function (request, response, next) {
    const agent = new WebhookClient({request, response});
    console.log("intent: " + agent.intent);

    function accountBalance(agent) {
        auth.authenticate(agent, () => agent.add(`Ihr Kontostand beträgt CHF 17536.90`));
    }

    function createPaymentQuestionPhrase() {
        return "Möchten Sie die Rechnung von " + invoices.get(invoices.size) + " bezahlen?";
    }

    function payment(agent) {
        const startMessage = "Sie haben 4 Rechnungen in Ihrem e-Bill Postfach:\n" +
            "Die erste Rechnung ist von Handy AG, über CHF 35.50.\n" +
            "Die zweite von Krankenkasse AG, über CHF 345.50.\n" +
            "Die dritte von Kreditkarten AG, über CHF 1598.10.\n" +
            "und die vierte von den Strom & Wasser AG, über CHF 421.75.\n" +
            "\n" +
            createPaymentQuestionPhrase();

        agent.add(startMessage);
    }

    function paymentYes(agent) {
        invoices.delete(invoices.size);
        agent.add("Die Rechnung wurde in Auftrag gegeben.");

        if (invoices.size !== 0) {
            agent.add("Möchten Sie die nächste Rechnung von " + invoices.get(invoices.size) + " ebenfalls bezahlen?");
        } else {
            agent.add("Alle Rechnungen wurden bearbeitet.");
        }
    }

    function paymentNo(agent) {
        invoices.delete(invoices.size);
        agent.add(createPaymentQuestionPhrase());
    }

    let intentMap = new Map();
    intentMap.set('Kontostand', accountBalance);
    intentMap.set('Kontostand - Code', accountBalance);
    intentMap.set('Kontostand - VoiceCode', accountBalance);
    intentMap.set('Payment', payment);
    intentMap.set('Payment - yes', paymentYes);
    intentMap.set('Payment - no', paymentNo);
    return agent.handleRequest(intentMap);
});


module.exports = router;
