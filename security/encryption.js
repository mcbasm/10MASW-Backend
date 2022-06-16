const crypto = require('crypto')
const CryptoJS = require("crypto-js");

let salt = 'f844b09ff50c'
let tokenFE = '654asd87as1cd'

exports.encrypt = (value) => {
    let encryptedData = crypto.pbkdf2Sync(value, salt,
        1000, 64, `sha512`).toString(`hex`);
    return encryptedData;
}

exports.decryptFE = (value) => {
    let bytes = CryptoJS.AES.decrypt(value, tokenFE)
    return bytes.toString(CryptoJS.enc.Utf8)
}