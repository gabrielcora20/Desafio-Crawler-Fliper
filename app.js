const { watch } = require('fs');
const puppeteer = require('puppeteer');

// const isElementVisible = async (page, cssSelector) => {
//     let visible = true;
//     await page
//         .waitForSelector(cssSelector, { visible: true, timeout: 2000 })
//         .catch(() => {
//             visible = false;
//         });
//     return visible;
// };


const legenda = {
    "nome": "",
    "qtdDownloads": 0,
    "nota": 0,
    "likeRatio": 0.00,
    "nomeQuemEnviou": "",
    "dataEnvio": new Date(),
    "idioma": "",
    "link": ""
};


(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://legendas.tv/');

    await page.evaluate(() => {
        document.querySelector('.js_entrar').click();
        document.querySelector('input[name="data[User][username]"]').setAttribute('value', 'fliperapp');
        document.querySelector('input[name="data[User][password]"]').setAttribute('value', '123456');
        document.querySelector('input[value="Entrar"]').click();
    });

    await page.waitForNavigation();

    await page.evaluate(() => {
        document.querySelector('#search-box').setAttribute('value', 'Os Simpsons');
        document.querySelector('input[type=submit].icon_zoom').click();
    });

    await page.waitForNavigation();

    let botaoVisivel = true

    while (botaoVisivel) {
        // console.log(await page.evaluate(() => {
        //     return Array.from(document.querySelectorAll('#resultado_busca>div:last-of-type article>div p:not(.data)'));
        // }));

        await page.evaluate(() => {
            document.querySelector('.load_more').click();
        });

        await page
            .waitForSelector('.load_more', { visible: true, timeout: 2000 })
            .catch(() => {
                botaoVisivel = false;
            });

        // botaoVisivel = await isElementVisible(page, '.load_more');
    }

    console.log(await page.evaluate(() => {
        return Array.from(document.querySelectorAll('#resultado_busca>div article>div p:not(.data)'));
    }));    

    // console.log(await page.evaluate(() => {
    //     var legendas = [];
    //     document.querySelectorAll('article>div>span').forEach(item => legendas.push(item.innerHTML));

    //     return legendas;
    // }));

    // console.log(legendas);

    // await page.screenshot({ path: 'example1.png', fullPage: true });

    //736

    await browser.close();
})();