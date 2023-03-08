const Sequelize = require("sequelize");
const connection = new Sequelize("mywordpress", "root", "Bruno210153", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;
