const verifyTwoFactorAuthenticationCode = require("./google-authenticator");
const AUTH_METHOD_PIN = "Pin";
const AUTH_METHOD_GOOGLE_AUTH = "Google Authenticator";
const AUTH_METHOD_VOICE_PRINT = "Voice Print";

const AUTH_METHOD = AUTH_METHOD_GOOGLE_AUTH;

module.exports = {
    authenticate: function authenticate(agent, onAccept) {
        console.log("parameters: " + agent.parameters);

        let success = () => {
            for (let key in agent.parameters) {
                agent.parameters[key] = "ok";
            }

            onAccept();
        };

        if (agent.parameters["word"] === undefined) {
            agent.add("Sie müssen sich zuerst authentifizieren.")
        }

        if (AUTH_METHOD === AUTH_METHOD_PIN) {
            withPin(agent, success);
        } else if (AUTH_METHOD === AUTH_METHOD_GOOGLE_AUTH) {
            withGoogleAuth(agent, success);
        } else if (AUTH_METHOD === AUTH_METHOD_VOICE_PRINT) {
            withVoicePrint(agent, success);
        } else {
            agent.add("Unbekannte Authentifizierungs-Methode: " + AUTH_METHOD);
        }
    }
}

function withVoicePrint(agent, onAccept) {
    const keyword = "Haustür";

    let spokenWord = agent.parameters["word"];
    if (spokenWord === undefined || spokenWord.length === 0) {
        let conv = agent.conv();
        conv.ask("Bitte wiederholen Sie folgendes Wort zur Authentifizierung: " + keyword)
        agent.add(conv);
    } else if (spokenWord === keyword) {
        onAccept();
    } else {
        let conv = agent.conv();
        conv.ask("Die Authentifzierung war nicht erfolgreich. Bitte wiederholen Sie das Wort : " +
                     keyword +
                     " nochmals");
        agent.add(conv);
    }
}

function withGoogleAuth(agent, onAccept) {
    let code = agent.parameters["code"];
    if (code === undefined || code.length === 0) {
        agent.add("Bitte sagen Sie den Code?");
    } else if (!verifyTwoFactorAuthenticationCode(code)) {
        agent.add("Der Code ist falsch. Bitte versuchen Sie es nochmals");
    } else {
        onAccept();
    }
}

function withPin(agent, onAccept) {
    let pinParam = agent.parameters["code"];
    if (pinParam === undefined || pinParam.length === 0) {
        agent.add("Wie lautet ihr persönlicher Pin?");
    } else if (parseInt(pinParam) !== 6428) {
        agent.add("Der Pin ist falsch. Bitte versuchen Sie es nochmals");
    } else {
        onAccept();
    }
}