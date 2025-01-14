const User = require("./models/userModel");

function testReadUser() {
  User.findById(1)
    .then((user) => {
      console.log(`Utilisateur : ${JSON.stringify(user, null, 2)}`);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération de l'utilisateur", error);
    });
}

testReadUser();
