module.exports = function ValidadorApiKey(req, res, next) {
    const chave = req.header("x-api-key");

    if (chave == new req.app.utils.Arquivo(req.app).visualizaJsonArquivo('api-keys.txt', true)['x-api-key'])
        next();
    else
	res.status(401).send("Unauthorized");
};