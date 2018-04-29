import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import { readConfigFileSync } from './helpers';

const config = readConfigFileSync();

const options = {
  viewEngine: {
    extname: '.hbs',
    layoutsDir: 'views/email/',
    defaultLayout: 'layout',
    partialsDir: 'views/email/'
  },
  viewPath: 'views/email/',
  extName: '.hbs'
};

let transporter = nodemailer.createTransport(config.app.smtp);

transporter.use('compile', hbs(options));

export default transporter;