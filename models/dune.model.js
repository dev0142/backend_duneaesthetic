module.exports = (sequelize, Sequelize) => {
  const Dune = sequelize.define("dune_user_data", {
    customer_name: {
      type: Sequelize.STRING,
    },
    phone_number: {
      type: Sequelize.STRING,
    },
    customer_email: {
      type: Sequelize.STRING,
    },
    notes: {
      type: Sequelize.STRING,
    },
    appointment_date: {
      type: Sequelize.STRING,
    },
  });

  return Dune;
};
