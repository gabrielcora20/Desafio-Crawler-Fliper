const _fs = require('fs');

function Arquivo(app) {
    this._criptografiaUtil = new app.utils.Criptografia();
}

Arquivo.prototype.gravaJsonArquivo = function (json, nomeArquivo, usarCriptografia) {
    if (usarCriptografia)
        _fs.writeFile(nomeArquivo, this._criptografiaUtil.encryptJson(json), function (err) {
            if (err) {
                return console.log(err);
            }
        });
    else
        _fs.writeFile(nomeArquivo, JSON.stringify(json), function (err) {
            if (err) {
                return console.log(err);
            }
        });
};

Arquivo.prototype.visualizaJsonArquivo = function (nomeArquivo, usarCriptografia) {
    if (usarCriptografia)
        return this._criptografiaUtil.decryptJson(JSON.parse(_fs.readFileSync(nomeArquivo).toString()));
    else
        return JSON.parse(_fs.readFileSync(nomeArquivo).toString());
};

module.exports = function () {
    return Arquivo;
};

