const mysql2=require("mysql2");

module.exports = {
    HOST: "srv1002.hstgr.io",
    USER: "u787342424_clinic_data",
    PASSWORD: "Dune@1234",
    DB: "u787342424_duneaesthetics",
    dialect: "mysql",
    dialectModule:mysql2,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };