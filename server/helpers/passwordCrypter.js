const bcrypt = require("bcrypt");

function passwordCrypter(plainTextPassword) {
  const password = bcrypt.hashSync(plainTextPassword, 10);
  return password;
}

function passwordCheck(password, userPassword) {
  return bcrypt.compareSync(password, userPassword);
}

module.exports = { passwordCrypter, passwordCheck };
