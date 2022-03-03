const express = require('express');
const app = express();
const puppeteer = require('puppeteer');


app.use(express.json())
app.use(express.static('public'))


app.get('/', (req, res) => {

    try {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));

    } catch (error) {
        res.json({ msg: `Um erro foi encontrado: ${error}` })
    }
})

app.get(`/generate-pdf`, async (req, res) => {

    try {
        const url = 'http:localhost:3001/template/layoutPdf.html'
        const fileName = 'pdfBackend'

        //puppperter: manipular paginas (Web crawling & scraping) 
        // headless : true - abre o navegador escondido(background)

        const browser = await puppeteer.launch({ headless: true }) // config default

        // config para debian
        /*const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],'
        })*/

        const page = await browser.newPage()

        // abre a pagina com endereço selecionado
        await page.goto(url, {
            waitUntil: 'networkidle0' // espera até carrega toda pagina
        })

        // O pupperteer possui uma funcao chamada pdf, que gera um pdf da pagina
        const pdf = await page.pdf({
            path: `./generated-pdf/${fileName}.pdf`,
            printBackground: true,
            format: 'a4',
            landscape: false,
            margin: {
                top: '100px',
                bottom: '100px',
                left: '20px',
                right: '20px'
            },
            displayHeaderFooter: true,
            headerTemplate: `<p style="font-size: 8px; margin: 0 auto;">
          <span>${fileName}</span> - <span class="date"></span></p>`,
            footerTemplate: `<p style="font-size:10px; margin: 0 auto;"><span
          class="pageNumber"></span> of <span class="totalPages"></span></p>`,
            width: '100px',
        })

        await browser.close()

        res.type('application/pdf')
        // res.send(pdf)

        // pdf downloading
        res.download(`./generated-pdf/${fileName}.pdf`)

    } catch (error) {
        console.log(`\nUm erro foi encontrado: ${error}`);
        res.status(408).json({ msg: error })
    }
})

app.listen(3001, () => console.log('Server is running on port 3001'))