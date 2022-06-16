const crypto = require('crypto')

const algorithm = 'aes-256-cbc'
let salt = 'f844b09ff50c'

exports.encrypt = (value) => {
    let encryptedData = crypto.pbkdf2Sync(value, salt,
        1000, 64, `sha512`).toString(`hex`);
    return encryptedData;
}