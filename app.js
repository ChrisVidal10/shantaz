const cheerio = require('cheerio');
const request = require('request-promise');
const nodemailer = require('nodemailer');
const config = require('config');

const tallaABuscar = '41'

const options = {
    uri: 'https://www.moovbydexter.com.ar/zapatillas-air-jordan-1-mid/NI_554724-122.html/',
    transform: (body) => {
        return cheerio.load(body);
    }
};

request(options)
    .then(function ($) {
        let stock = false
        const divTallas = $('.variation-attribute-size').each((i, e) => {
            if ($(e).text().trim() === tallaABuscar && $(e).attr().value !== 'null') {
                console.log('Hay stock');
                stock = true;
                enviarCorreo();
            };
        });
        if (!stock) console.log('No hay stock, nos vemos en la proxima ejecucion');
    })
    .catch(function (err) {
        console.log(err.message);
    });

    
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.get('mailSenderCredentials.mail'),
        pass: config.get('mailSenderCredentials.password')
    }
});

function enviarCorreo(){
    console.log('Enviando mensaje');

    var mailOptions = {
        from: config.get('mailSenderCredentials.mail'),
        to: config.get('mailReceptorCredentials.mail'),
        subject: 'SHANTAZ',
        text: 'Hay stock herma, compra las SHANTAZ! 🚀👟'
    };
    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}