import dotenv from 'dotenv';

dotenv.config({
  silent: true
});

export default {
  secret: process.env.SECRET,
  port: process.env.PORT,
  env: process.env.NODE_ENV
}
