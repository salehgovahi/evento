const crypto = require('crypto');

const environments = require('../configs/environments');

const ENCRYPTION_KEY = environments.ENCRYPTION_KEY
const IV_LENGTH = 16;

function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest(); // 32-byte key
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}


module.exports = {
    encrypt
};