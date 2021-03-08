const speakeasy = require("speakeasy");

const APP_NAME = "Sprach Bank";
const SECRET = "LBKVKT3QNFMGWTB6KZZT4KREIZ5HU6SRK53WMI2LHFEVIUK2KFVQ"; //otpauth://totp/Sprach%20Bank?secret=LBKVKT3QNFMGWTB6KZZT4KREIZ5HU6SRK53WMI2LHFEVIUK2KFVQ


const generateNewAppAuthenticationSecret = () => {
    const secretCode = speakeasy.generateSecret({
                                                    name: APP_NAME,
                                                });
    return {
        otpauthUrl: secretCode.otpauth_url,
        base32: secretCode.base32,
    };
};

const verifyTwoFactorAuthenticationCode = spokenCode => speakeasy.totp.verify({
                                                                                  secret: SECRET,
                                                                                  encoding: 'base32',
                                                                                  token: spokenCode,
                                                                              });

module.exports = generateNewAppAuthenticationSecret;
module.exports = verifyTwoFactorAuthenticationCode;
