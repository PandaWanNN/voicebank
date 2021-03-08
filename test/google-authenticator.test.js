const verifyTwoFactorAuthenticationCode = require("../routes/google-authenticator");
const generateNewAppAuthenticationSecret = require("../routes/google-authenticator");
const {describe} = require("@jest/globals");
describe('2FA Code', () => {
    let code = generateNewAppAuthenticationSecret();
    expect(code.base32).toBe("HJHGMRLRJBYX27KEKNRVG62SKE3DCRJTMFIHSTJ2GZCW4TC3GZIA");
});

describe('verify 2FA Code', () => {
    let result = verifyTwoFactorAuthenticationCode("852216");
    expect(result).toBeTruthy();
});