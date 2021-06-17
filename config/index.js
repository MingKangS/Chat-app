const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  MONGO_URI: "mongodb+srv://mingkang:1234@cluster0.oydwh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET
};
