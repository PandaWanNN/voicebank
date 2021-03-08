const verifyTwoFactorAuthenticationCode = require("./google-authenticator");
const AUTH_METHOD_PIN = "Pin";
const AUTH_METHOD_GOOGLE_AUTH = "Google Authenticator";
const AUTH_METHOD = AUTH_METHOD_GOOGLE_AUTH;

module.exports = {
    authenticate: function authenticate(agent, onAccept) {
        if (AUTH_METHOD === AUTH_METHOD_PIN) {
            withPin(agent, onAccept);
        } else if (AUTH_METHOD === AUTH_METHOD_GOOGLE_AUTH) {
            withGoogleAuth(agent, onAccept);
        } else {
            agent.add("Unbekannte Authentifizierungs-Methode: " + AUTH_METHOD);
        }
    }
}

function withGoogleAuth(agent, onAccept) {
    let pinParam = agent.parameters["pin"];
    if (pinParam.length === 0) {
        agent.add("Wie lautet dein Passwort?");
    } else if (!verifyTwoFactorAuthenticationCode(pinParam)) {
        agent.add("Das Passwort ist falsch. Versuch es nochmals");
    } else {
        onAccept();
    }
}

function withPin(agent, onAccept) {
    let pinParam = agent.parameters["pin"];
    if (pinParam.length === 0) {
        agent.add("Wie lautet dein Passwort?");
    } else if (pinParam !== 6428) {
        agent.add("Das Passwort ist falsch. Versuch es nochmals");
    } else {
        onAccept();
    }
}