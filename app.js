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
    let legendas = [];

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

    // console.log(await page.$$('#resultado_busca>div article>div p:not(.data) a'));

    // console.log(Array.isArray(await page.evaluate(() => {
    //     return Array.from(document.querySelectorAll('#resultado_busca>div article>div p:not(.data) a')).map(link => link.innerText);
    // })));

    // let elements = await page.$$('#resultado_busca>div article>div p:not(.data) a')

    let elements = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('#resultado_busca>div article>div p:not(.data) a')).map(link => link.href);
    });

    // console.log(elements);

    // elements.forEach(link => await( async () => {
    //     // const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
    //     // // declare promise
    //     // link.click({ button: 'middle' });                 // click middle button, link open in a new tab
    //     // const pagDetalheLegenda = newPagePromise;                   // declare new tab, now you can work with it
    //     // pagDetalheLegenda.bringToFront();

    //     // pagDetalheLegenda.waitForNavigation();

    //     const pageTarget = page.target();
    //     //execute click on first tab that triggers opening of new tab:
    //     await page.click('a[href="' + link.replace("http://legendas.tv", "") + '"]');
    //     // link.click();
    //     //check that the first page opened this new page:
    //     const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);
    //     //get the new page object:
    //     const newPage = await newTarget.page();

    //     await newPage.screenshot({ path: 'example1.png', fullPage: true });

    //     // await newPage.evaluate(() => {
    //     //     console.log(document.querySelectorAll('.middle.download section:not(.first) h1')[0].innerText);
    //     // });
    // }));

    for (let i = 0; i < elements.length; i++) {
        let link = elements[i];
        const pageDetalheLegenda = await browser.newPage();
        await pageDetalheLegenda.goto(link);


        // const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
        // // declare promise
        // await page.click('a[href="${link.getProperty("href")}"]', { button: 'middle' });                 // click middle button, link open in a new tab
        // const pagDetalheLegenda = await newPagePromise;                   // declare new tab, now you can work with it
        // await pagDetalheLegenda.bringToFront();

        // await pageDetalheLegenda.waitForNavigation();

        await pageDetalheLegenda.bringToFront();

        await pageDetalheLegenda.screenshot({ path: 'example1.png', fullPage: true });

        let qtdLikesLegenda = await pageDetalheLegenda.evaluate(() => parseInt(document.querySelectorAll('body > div.container > div.middle.download > section:nth-child(2) > aside:nth-child(4) > p:nth-child(1)')[0].innerText));
        let qtdDeslikesLegenda = await pageDetalheLegenda.evaluate(() => parseInt(document.querySelectorAll('body > div.container > div.middle.download > section:nth-child(2) > aside:nth-child(4) > p:nth-child(2)')[0].innerText));
        let dataString = await pageDetalheLegenda.evaluate(() => document.querySelectorAll('body > div.container > div.middle.download > section:nth-child(2) > aside:nth-child(2) > p > span.date')[0].innerText);

        console.log(await pageDetalheLegenda.evaluate((qtdLikesLegenda, qtdDeslikesLegenda, dataString) => {
            return 'nome ' + document.querySelectorAll('body > div.container > div.middle.download > section:nth-child(2) > h1')[0].innerText
                + '\n qtd down ' + parseInt(document.querySelectorAll('body > div.container > div.middle.download > section:nth-child(2) > aside:nth-child(3) > p > span')[0].innerText).toString()
                + '\n nota ' + parseInt((qtdLikesLegenda / (qtdLikesLegenda + qtdDeslikesLegenda)) * 10).toString()
                + '\n like ratio ' + parseFloat(qtdLikesLegenda / qtdDeslikesLegenda).toFixed(2).toString()
                + '\n nome quem enviou ' + document.querySelectorAll('body > div.container > div.middle.download > section:nth-child(2) > aside:nth-child(2) > p > span.nume > a')[0].innerText
                + '\n data que foi enviada ' + dataString
                + '\n idioma ' + document.querySelectorAll('body > div.container > div.middle.download > section:nth-child(2) > h1 > img')[0].getAttribute('alt')
                + '\n link para download ' + document.querySelectorAll('body > div.container > div.middle.download > section:last-of-type > button')[0].getAttribute('onclick').split('\'').filter(trecho => trecho.includes('download')).shift();
        }, qtdLikesLegenda, qtdDeslikesLegenda, dataString));

        legendas.push(await pageDetalheLegenda.evaluate((qtdLikesLegenda, qtdDeslikesLegenda, dataString) => {
            return {
                nome: document.querySelectorAll('body > div.container > div.middle.download > section:nth-child(2) > h1')[0].innerText + dataString,
                qtdDownloads: parseInt(document.querySelectorAll('body > div.container > div.middle.download > section:nth-child(2) > aside:nth-child(3) > p > span')[0].innerText),
                nota: parseInt((qtdLikesLegenda / (qtdLikesLegenda + qtdDeslikesLegenda)) * 10),
                likeRatio: parseFloat(qtdLikesLegenda / qtdDeslikesLegenda).toFixed(2),
                nomeQuemEnviou: document.querySelectorAll('body > div.container > div.middle.download > section:nth-child(2) > aside:nth-child(2) > p > span.nume > a')[0].innerText,
                dataEnvio: dataString,
                idioma: document.querySelectorAll('body > div.container > div.middle.download > section:nth-child(2) > h1 > img')[0].getAttribute('alt'),
                link: document.querySelectorAll('body > div.container > div.middle.download > section:last-of-type > button')[0].getAttribute('onclick').split('\'').filter(trecho => trecho.includes('download')).shift()
            };
        }, qtdLikesLegenda, qtdDeslikesLegenda, dataString));


        await pageDetalheLegenda.close();
    }

    legendas.forEach(legenda => legenda.dataEnvio = new Date(legenda.dataEnvio.split('/')[1] + "/" + legenda.dataEnvio.split('/')[0] + "/" + legenda.dataEnvio.split('/')[2]));

    console.log(legendas);

    await page.bringToFront();

    // elements.forEach(async link => {
    //     // let link = elements[0]; 
    //     const pageDetalheLegenda = await browser.newPage();
    //     await pageDetalheLegenda.goto(link, {
    //         waitUntil: 'load',
    //         // Remove the timeout
    //         timeout: 0
    //     });

    //     // const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
    //     // // declare promise
    //     // await page.click('a[href="${link.getProperty("href")}"]', { button: 'middle' });                 // click middle button, link open in a new tab
    //     // const pagDetalheLegenda = await newPagePromise;                   // declare new tab, now you can work with it
    //     // await pagDetalheLegenda.bringToFront();

    //     await pageDetalheLegenda.waitForNavigation();

    //     await pageDetalheLegenda.screenshot({ path: 'example1.png', fullPage: true });

    //     await pageDetalheLegenda.evaluate(() => {
    //         console.log(document.querySelectorAll('.middle.download section:not(.first) h1')[0].innerText);
    //     });

    //     // pageDetalheLegenda.close();

    //     // console.log('a[href="' + link.replace("http://legendas.tv", "") + '"]');
    //     //save target of original page to know that this was the opener:     
    //     //  const pageTarget = page.target();
    //     // //execute click on first tab that triggers opening of new tab:
    //     // await page.click('a[href="' + link.replace("http://legendas.tv", "") + '"]', { button: 'middle' });


    //     // //check that the first page opened this new page:
    //     //  const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);
    //     // //get the new page object:
    //     //  const newPage = await newTarget.page();

    // });








    // console.log(await page.evaluate(() => {
    //     return Array.from(document.querySelectorAll('#resultado_busca>div article>div p:not(.data) a'));
    // }));

    // console.log(await page.evaluate(() => {
    //     var legendas = [];
    //     document.querySelectorAll('article>div>span').forEach(item => legendas.push(item.innerHTML));

    //     return legendas;
    // }));

    // console.log(legendas);

    // await page.screenshot({ path: 'example1.png', fullPage: true });

    //736

    // await browser.close();
})();