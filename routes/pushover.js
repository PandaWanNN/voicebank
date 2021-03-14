const httpreq = require("httpreq");

//https://pushover.net/
const sendPushNotification = () => {

    httpreq.post("https://api.pushover.net/1/messages.json", {
        json: {
            token: "a2dcu2513cx58uveo9acx9cgca5dpb",
            user: "uau7617rgi6ftq8s7km8y33o3nx3v4",
            title: "Voice Bank",
            message: "Play sound",
            sound: "echo"
        }
    }, function (err, res) {
        console.log(err);
        console.log(res);
    });

    return true;

};

module.exports = sendPushNotification;
