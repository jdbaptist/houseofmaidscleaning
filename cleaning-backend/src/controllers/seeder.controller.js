const User = require("../models/users.model");

// Initial Seeder to create Admin
exports.initial_seeder = async (req, res) => {
  const body = {
    email: "admin@mail.com",
    password: "admin1234",
    firstname: "Cleaning",
    lastname: "Admin",
    eId: 0,
  };

  body.role = 0; // 0 - Admin
  const user = new User(body);

  try {
    const data = await user.save();

    return res.status(200).send({
      status: true,
      status_code: 200,
      data,
    });
  } catch (error) {
    let error_fields = [];
    if (error.hasOwnProperty("errors")) {
      for (let key in error.errors) {
        error_fields.push(key);
      }
    }

    return res.status(400).send({
      status: false,
      status_code: 400,
      error,
      error_fields,
    });
  }
};
