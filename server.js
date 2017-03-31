const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const Routes = require('./server/routes');
const config = require('./config/config');

const port = config.port;
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/api', Routes.UserRouter);
app.use('/api', Routes.DocRouter);
app.use('/api', Routes.RoleRouter);

app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the Docs API!',
}));

app.listen(port);
console.log(`go to http://localhost:${port}`);

module.exports = app;
