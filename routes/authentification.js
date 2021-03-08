const AUTH_METHOD_PIN = "pin";
const AUTH_METHOD = AUTH_METHOD_PIN;

module.exports = {
    authenticate: function authenticate(agent, onAccept) {
        if (AUTH_METHOD === AUTH_METHOD_PIN) {
            withPin(agent, onAccept);
        } else {
            agent.add("Unbekannte Authentifizierungs-Methode: " + AUTH_METHOD);
        }
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