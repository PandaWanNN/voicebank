const wordMap = new Map();
wordMap.set(1, "Sonnenschein");
wordMap.set(2, "Schmetterling");
wordMap.set(3, "Mond");

const startVoicePrint = (agent) => {
    if (wordMap.size === 3) {
        agent.add("Willkommen zur Sprachkonfiguration");
    }

    if (wordMap.size !== 0) {
        agent.add("Bitte wiederholen sie folgendes Wort: " + wordMap.get(wordMap.size));
        wordMap.delete(wordMap.size);
    } else {
        agent.add("Die Sprachkonfiguration wurde erfolgreich abgeschlossen");
    }

};

module.exports = startVoicePrint;