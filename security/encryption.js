const crypto = require("crypto");
const CryptoJS = require("crypto-js");
require("dotenv").config();

exports.encrypt = (value) => {
  let encryptedData = crypto
    .pbkdf2Sync(value, process.env.salt, 1000, 64, `sha512`)
    .toString(`hex`);
  return encryptedData;
};

exports.decryptFE = (value) => {
  let bytes = CryptoJS.AES.decrypt(value, process.env.tokenFE);
  return bytes.toString(CryptoJS.enc.Utf8);
};
