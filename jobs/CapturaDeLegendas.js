const _mongoDbObjectId = require('mongodb').ObjectID;
const _puppeteer = require('puppeteer');

function CapturaDeLegendas(app) {
    this._arquivoUtil = new app.utils.Arquivo(app);
    this._repositorioLegenda = new app.data.DbConnection("legendas");
    this.detalhesLegendas = [];
}

CapturaDeLegendas.prototype.executa = async function () {
    console.log('Serviço de captura de legendas iniciado');

    let credenciaisAcesso = {};

    credenciaisAcesso = this._arquivoUtil.visualizaJsonArquivo("./credenciais-acesso-legendas.txt", true);

    const browser = await _puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://legendas.tv/');

    await page.evaluate((credenciaisAcesso) => {
        document.querySelector('.js_entrar').click();
        document.querySelector('input[name="data[User][username]"]').setAttribute('value', credenciaisAcesso.usuario);
        document.querySelector('input[name="data[User][password]"]').setAttribute('value', credenciaisAcesso.senha);
        document.querySelector('input[value="Entrar"]').click();
    }, credenciaisAcesso);

    await page.waitForNavigation();

    await page.evaluate(() => {
        document.querySelector('#search-box').setAttribute('value', 'Os Simpsons');
        document.querySelector('input[type=submit].icon_zoom').click();
    });

    await page.waitForNavigation();

    let botaoVisivel = true;
    let posicaoPagina = 1;

    while (botaoVisivel) {

        await page
            .waitForSelector('#resultado_busca > div:nth-child(' + posicaoPagina + ') > article > div > div > p:not(.data) > a', { visible: true, timeout: 0 });

        await page.evaluate((posicaoPagina) => {
            return Array.from(document.querySelectorAll('#resultado_busca > div:nth-child(' + posicaoPagina + ') > article > div')).map(elemento => {
                return {
                    nome: elemento.querySelector('div > p:nth-child(1) > a').innerText,
                    link: elemento.querySelector('div > p:nth-child(1) > a').href,
                    idioma: elemento.querySelector('img').getAttribute('alt')
                }
            });
        }, posicaoPagina)
            .then(async (legendas) => {
                posicaoPagina++;

                let novasLegendas = [];

                for (let i = 0; i < legendas.length; i++) {
                    let legenda = legendas[i];
                    const pageDetalheLegenda = await browser.newPage();
                    await pageDetalheLegenda.goto(legenda.link);

                    await pageDetalheLegenda.bringToFront();

                    let qtdLikesLegenda = await pageDetalheLegenda.evaluate(() =>
                        parseInt(document.querySelector('body > div.container > div.middle.download > section:nth-child(2) > aside:nth-child(4) > p:nth-child(1)').innerText)
                    );

                    let qtdDeslikesLegenda = await pageDetalheLegenda.evaluate(() =>
                        parseInt(document.querySelector('body > div.container > div.middle.download > section:nth-child(2) > aside:nth-child(4) > p:nth-child(2)').innerText)
                    );

                    let dataString = await pageDetalheLegenda.evaluate(() =>
                        document.querySelector('body > div.container > div.middle.download > section:nth-child(2) > aside:nth-child(2) > p > span.date').innerText
                    );

                    novasLegendas.push(await pageDetalheLegenda.evaluate((qtdLikesLegenda, qtdDeslikesLegenda, dataString, legenda) => {
                        return {
                            nome: legenda.nome,
                            qtdDownloads: parseInt(document.querySelector('body > div.container > div.middle.download > section:nth-child(2) > aside:nth-child(3) > p > span').innerText),
                            nota: parseInt((qtdLikesLegenda / (qtdLikesLegenda + qtdDeslikesLegenda)) * 10) ? parseInt((qtdLikesLegenda / (qtdLikesLegenda + qtdDeslikesLegenda)) * 10) : 10,
                            likeRatio: (() => {
                                if (qtdLikesLegenda > 0 && qtdDeslikesLegenda > 0)
                                    return parseFloat((qtdLikesLegenda / qtdDeslikesLegenda).toFixed(2));
                                else if (!qtdLikesLegenda)
                                    return 0.00;
                                else if (!qtdDeslikesLegenda)
                                    return null;
                            })(),
                            nomeQuemEnviou: document.querySelector('body > div.container > div.middle.download > section:nth-child(2) > aside:nth-child(2) > p > span.nume > a').innerText,
                            dataEnvio: dataString,
                            idioma: legenda.idioma,
                            link: 'http://legendas.tv' + document.querySelector('body > div.container > div.middle.download > section:last-of-type > button').getAttribute('onclick').split('\'').filter(trecho => trecho.includes('download')).shift()
                        };
                    }, qtdLikesLegenda, qtdDeslikesLegenda, dataString, legenda));


                    await pageDetalheLegenda.close();
                }

                novasLegendas.forEach(legenda => legenda.dataEnvio = new Date(legenda.dataEnvio.split('/')[1] + "/" + legenda.dataEnvio.split('/')[0] + "/" + legenda.dataEnvio.split('/')[2]));

                this.detalhesLegendas = this.detalhesLegendas.concat(novasLegendas);
            });

        await page.bringToFront();

        await page.evaluate(() => {
            document.querySelector('.load_more').click();
        });

        await page
            .waitForSelector('.load_more', { visible: true, timeout: 2000 })
            .catch(() => {
                botaoVisivel = false;
            });
    }

    this.detalhesLegendas.forEach(detalheLegenda => {
        this._repositorioLegenda.consultaUnico({ link: detalheLegenda.link }, (result, erro) => {
            if (erro)
                console.log(erro);
            else {
                if (!result)
                    this._repositorioLegenda.insere(detalheLegenda);
                else {
                    detalheLegenda._id = result._id;
                    this._repositorioLegenda.atualiza({ _id: mongoDbObjectId(detalheLegenda._id) }, detalheLegenda);
                }
            }
        });
    });

    console.log('Legendas encontradas: ' + this.detalhesLegendas.length);

    await browser.close();
};

module.exports = function () {
    return CapturaDeLegendas;
};