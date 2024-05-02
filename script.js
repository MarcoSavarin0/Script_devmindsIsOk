import { createTransport } from 'nodemailer'
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    },
});
async function sendEmail(to, subject, text) {
    try {

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: to,
            subject: subject,
            text: text
        }
        await transporter.sendMail(mailOptions);
        console.log(`enviado`);
    } catch (error) {
        console.error(' error al enviar el gmail:', error);
    }
}

async function checkStatusWeb() {
    const web = "https://devminds.me/";

    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.goto(web);
        const text = await page.evaluate(() => {
            const element = document.querySelector('div.relative.p-4.mt-20.md\\:py-20 > div.grid.max-w-6xl.mx-auto.mt-5.md\\:grid-cols-2 > div > div:nth-child(2) > div > p');
            return element ? element.innerText : "";
        });
        if (text == "") {
            await sendEmail("devmindsbusiness@gmail.com", "La pagina esta caida", "Checkea la pagina, creo que esta actualmente caida!")
        } else {
            console.log('ok');
        }

        await browser.close();
    } catch (error) {
        console.error("Error checking: ", error);
        return null;
    }
}





async function main() {
    sendEmail("devmindsbusiness@gmail.com", "Se ha iniciado el proceso de monitoreo de la pagina de devminds", "HOLA MUNDO")
    while (true) {
        try {
            await checkStatusWeb();
            console.log("Waiting for the next check...");
            await new Promise(resolve => setTimeout(resolve, 60 * 60 * 1000));
        } catch (error) {
            console.error("Error in main loop:", error);
        }
    }
}


main()