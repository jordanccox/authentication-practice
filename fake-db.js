const users = [
  {
    username: "jordan",
    password: "123456"
  }
];

module.exports.findByUsername = function (username) {
  let foundUser = null;

  users.forEach((user) => {
    if (user.username === username) {
      foundUser = user;
    }
  });

  return foundUser;
};