const verifyTwoFactorAuthenticationCode = require("./google-authenticator");
const sendPushNotification = require("./pushover");
const startMicrosoftAuth = require("./microsoft-authenticator");
const AUTH_METHOD_PIN = "Pin";
const AUTH_METHOD_GOOGLE_AUTH = "Google Authenticator";
const AUTH_METHOD_VOICE_PRINT = "Voice Print";
const AUTH_METHOD_SOUND_AUTH = "Sound Auth";
const AUTH_METHOD_MICROSOFT_AUTH = "Microsoft Authenticator";
const AUTH_METHOD_NONE = "None";

const AUTH_METHOD = AUTH_METHOD_NONE;
let CUSTOM_PIN;

module.exports = {
    authenticate: function authenticate(agent, onAccept) {
        console.log("parameters: " + agent.parameters);

        let success = () => {
            for (let key in agent.parameters) {
                agent.parameters[key] = "ok";
            }

            onAccept();
        };

        if (AUTH_METHOD !== AUTH_METHOD_NONE && agent.parameters["word"] === undefined) {
            agent.add("Sie müssen sich zuerst authentifizieren.")
        }

        if (AUTH_METHOD === AUTH_METHOD_PIN) {
            withPin(agent, success);
        } else if (AUTH_METHOD === AUTH_METHOD_GOOGLE_AUTH) {
            withGoogleAuth(agent, success);
        } else if (AUTH_METHOD === AUTH_METHOD_VOICE_PRINT) {
            withVoicePrint(agent, success);
        } else if (AUTH_METHOD === AUTH_METHOD_SOUND_AUTH) {
            withSoundAuth(agent, success);
        } else if (AUTH_METHOD === AUTH_METHOD_MICROSOFT_AUTH) {
            withMicrosoftAuth(agent, success);
        } else if (AUTH_METHOD === AUTH_METHOD_NONE) {
            success();
        } else {
            agent.add("Unbekannte Authentifizierungs-Methode: " + AUTH_METHOD);
        }

    },

    pinConfig: function pinConfig(agent) {
        let pinParam = agent.parameters["pin"];
        console.log(pinParam);
        if (pinParam !== undefined && pinParam.length !== 0) {
            CUSTOM_PIN = parseInt(pinParam);
            let characters = Array.from(pinParam);
            let numbers = "";
            characters.forEach(value => numbers = numbers + " " + value);

            if (characters.length === 4) {
                agent.end("Der Pin Code: " + numbers + " wurde erfolgreich gespeichert.");
            } else {
                agent.add("Der Pin Code: " + numbers + " ist ungültig.")
            }
        } else {
            agent.add("Bitte sagen Sie Ihren persönlichen 4-stelligen Pin Code");
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
        conv.ask("Die Authentifizierung war nicht erfolgreich. Bitte wiederholen Sie das Wort : " +
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
    } else if (parseInt(pinParam) !== CUSTOM_PIN) {
        agent.add("Der Pin ist falsch. Bitte versuchen Sie es nochmals");
    } else {
        onAccept();
    }
}

function withSoundAuth(agent, onAccept) {
    let spokenWord = agent.parameters["word"];
    if (spokenWord === undefined || spokenWord.length === 0) {
        setTimeout(args => sendPushNotification(), 12000);
        agent.add(
            "Ich verwende Ihr Mobiltelefon zur Authentifizierung. Bitte sagen Sie: Sprach bank mach weiter, nachdem Ihr Mobiltelefon einen Ton abgespielt hat.");
    } else {
        onAccept();
    }
}

function withMicrosoftAuth(agent, onAccept) {
    let spokenWord = agent.parameters["word"];
    if (spokenWord === undefined || spokenWord.length === 0) {
        setTimeout(args => startMicrosoftAuth(), 3000);
        agent.add(
            "Bitte bestätigen Sie den Zugang auf ihrem Mobiltelefon und sagen sie anschliessend: Sprach bank mach weiter.");
    } else {
        onAccept();
    }
}