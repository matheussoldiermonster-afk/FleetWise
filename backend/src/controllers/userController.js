const userService = require("../services/userService");

async function create(req, res) {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

module.exports = {
  create
};