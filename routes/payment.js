const invoices = new Map();
invoices.set(1, "Strom & Wasser AG, fällig am 2. Juni 2021, über CHF 421.75");
invoices.set(2, "Kreditkarten AG, fällig am 2. Mai 2021, über CHF 1598.10");
invoices.set(3, "Krankenkasse AG, fällig am 31. Mai 2021, über CHF 345.50");
invoices.set(4, "Handy AG, fällig am 15. Mai 2021, über CHF 35.50");

module.exports = {
    payment: function payment(agent) {
        const startMessage = "Sie haben 4 Rechnungen in Ihrem e-Bill Postfach:\n" +
            "Die erste Rechnung ist von Handy AG, über CHF 35.50.\n" +
            "Die zweite von Krankenkasse AG, über CHF 345.50.\n" +
            "Die dritte von Kreditkarten AG, über CHF 1598.10.\n" +
            "und die vierte von den Strom & Wasser AG, über CHF 421.75.\n" +
            "\n" +
            createPaymentQuestionPhrase();

        agent.add(startMessage);
    },

    paymentYes: function paymentYes(agent) {
        invoices.delete(invoices.size);
        agent.add("Die Rechnung wurde in Auftrag gegeben.");

        if (invoices.size !== 0) {
            agent.add("Möchten Sie die nächste Rechnung von " + invoices.get(invoices.size) + " ebenfalls bezahlen?");
        } else {
            agent.add("Alle Rechnungen wurden bearbeitet.");
        }
    },

    paymentNo: function paymentNo(agent) {
        invoices.delete(invoices.size);
        if (invoices.size !== 0) {
            agent.add(createPaymentQuestionPhrase());
        } else {
            agent.add("Alle Rechnungen wurden bearbeitet.");
        }
    }
}

function createPaymentQuestionPhrase() {
    return "Möchten Sie die Rechnung von " + invoices.get(invoices.size) + " bezahlen?";
}