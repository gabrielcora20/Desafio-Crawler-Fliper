const _crypto = require('crypto');


function Criptografia() {
    this.algorithm = 'aes-256-ctr';
    this.secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
}

Criptografia.prototype.encrypt = function (text) {
    const iv = _crypto.randomBytes(16);

    const cipher = _crypto.createCipheriv(this.algorithm, this.secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

Criptografia.prototype.encryptJson = function (text) {
    const iv = _crypto.randomBytes(16);

    const cipher = _crypto.createCipheriv(this.algorithm, this.secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return JSON.stringify({
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    });
};

Criptografia.prototype.decrypt = function (hash) {

    const decipher = _crypto.createDecipheriv(this.algorithm, this.secretKey, Buffer.from(hash.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

Criptografia.prototype.decryptJson = function (hash) {

    const decipher = _crypto.createDecipheriv(this.algorithm, this.secretKey, Buffer.from(hash.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return JSON.parse(decrpyted.toString());
};

module.exports = function () {
    return Criptografia;
};