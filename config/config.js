const dotenv = require('dotenv');

dotenv.config({
  silent: true
});

module.exports = {
  secret: process.env.SECRET,
  port: process.env.PORT,
  env: process.env.NODE_ENV
}
