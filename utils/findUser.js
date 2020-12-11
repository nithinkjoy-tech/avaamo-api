const {User} = require("../models/user");

module.exports = async function (userId) {
  let user;
  userId = userId.toLowerCase();

  user = await User.findOne({
    email: userId,
  });

  if (!user) {
    user = await User.findOne({
      username: userId,
    });
  }
  return user;
};
