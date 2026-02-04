const bcrypt = require("bcryptjs");

bcrypt.hash("siva2906", 10).then(hash => {
  console.log(hash);
});
