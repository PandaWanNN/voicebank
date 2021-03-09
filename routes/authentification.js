const verifyTwoFactorAuthenticationCode = require("./google-authenticator");
const AUTH_METHOD_PIN = "Pin";
const AUTH_METHOD_GOOGLE_AUTH = "Google Authenticator";
const AUTH_METHOD_VOICE_PRINT = "Voice Print";

const AUTH_METHOD = AUTH_METHOD_VOICE_PRINT;

module.exports = {
    authenticate: function authenticate(agent, onAccept) {
        if (AUTH_METHOD === AUTH_METHOD_PIN) {
            withPin(agent, onAccept);
        } else if (AUTH_METHOD === AUTH_METHOD_GOOGLE_AUTH) {
            withGoogleAuth(agent, onAccept);
        } else if (AUTH_METHOD === AUTH_METHOD_VOICE_PRINT) {
            withVoicePrint(agent, onAccept);
        } else {
            agent.add("Unbekannte Authentifizierungs-Methode: " + AUTH_METHOD);
        }
    }
}

function withVoicePrint(agent, onAccept) {
    const keyword = "Haustür";
    let spokenWord = agent.parameters["spokenWord"];
    if (spokenWord === undefined || spokenWord.length === 0) {
        agent.add("Bitte wiederhole folgendes Wort zur Authentifizierung: " + keyword);
    } else {
        onAccept();
    }
}

function withGoogleAuth(agent, onAccept) {
    let pinParam = agent.parameters["pin"];
    if (pinParam.length === 0) {
        agent.add("Sie müssen authentifizieren, bitte sagen Sie den Code?");
    } else if (!verifyTwoFactorAuthenticationCode(pinParam)) {
        agent.add("Der Code ist falsch. Bitte versuchen Sie es nochmals");
    } else {
        onAccept();
    }
}

function withPin(agent, onAccept) {
    let pinParam = agent.parameters["pin"];
    if (pinParam.length === 0) {
        agent.add("Wie lautet ihr Pin?");
    } else if (pinParam !== 6428) {
        agent.add("Der Pin ist falsch. Bitte versuchen Sie es nochmals");
    } else {
        onAccept();
    }
}