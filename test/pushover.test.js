const sendPushNotification = require("../routes/pushover");
const {describe} = require("@jest/globals");

describe('vtouch', () => {
    sendPushNotification();
    expect(true).toBeTruthy();
});