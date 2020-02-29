const puppeteer = require('puppeteer');
const fs = require('fs');

(() => {

    fs.readFile('./to-populate.txt', 'utf8', async function (err, contents) {
        const searchTerms = contents.split("\n");

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        for (var searchTerm of searchTerms) {
            newSearchTerm = searchTerm.replace(" ", "+");

            await page.goto(`https://www.google.com/search?q=${newSearchTerm}`);

            const result = await page.evaluate(() => {

                const topLink = document.querySelector("#search a").href

                return topLink;
            }).catch((err) => {
                console.log(err);
            });

            if (result) {
                console.log(`Found ${result.trim()} for ${searchTerm.trim()}`)
                fs.appendFileSync('urls.csv', `${searchTerm.trim()},${result.trim()}\n`);
            } else {
                console.warn(`Unable to find URL for ${searchTerm.trim()}`)
            }

        }
        await browser.close();
    });


})();