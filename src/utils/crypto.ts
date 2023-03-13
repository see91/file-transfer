import CryptoJS from 'crypto-js';

const SECRET_IV = CryptoJS.enc.Utf8.parse("1234123412341234");

export const encrypt = (text:string, secretKey) => {

    /*const dataHex = CryptoJS.enc.Utf8.parse(text);
    const secretKeyHex = CryptoJS.enc.Utf8.parse(secretKey);
    const encrypted = CryptoJS.AES.encrypt(dataHex, secretKeyHex, {
        iv: SECRET_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    return encrypted.ciphertext.toString();*/
    return CryptoJS.AES.encrypt(text, secretKey).toString()

};

export const decrypt = (ciphertext, secretKey) => {

    /*const secretKeyHex = CryptoJS.enc.Utf8.parse(secretKey);

    const encryptedHexStr = CryptoJS.enc.Hex.parse(ciphertext);
    const str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const decrypt = CryptoJS.AES.decrypt(str, secretKeyHex, {
        iv: SECRET_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();*/
    debugger
    const bytes  = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText

};
