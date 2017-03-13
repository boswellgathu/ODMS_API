import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import Routes from './server/routes';
import config from './config/config';

const port = config.port;
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Require our routes into the application.
Routes(app);

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the Docs API!',
}));

app.listen(port);
console.log(`go to http://localhost:${port}`);

module.exports = app;
