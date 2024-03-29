const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const mysql2 = require("mysql2");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  dialectModule: mysql2,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.dune_user_data = require("./dune.model.js")(sequelize, Sequelize);

module.exports = db;
