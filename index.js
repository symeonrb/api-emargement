require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/apiRoutes");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Pour gérer les formulaires encodés en URL

// Routes
app.use("/api", apiRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API d'émargement est en cours d'exécution.");
});

module.exports = app;

// Démarrer le serveur
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}
