const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authController = {
  async signup(req, res) {
    const { name, email, password, role } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = await User.create(name, email, hashedPassword, role);
      res.status(201).json({ message: "Utilisateur créé", userId });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({
        error: "Erreur lors de l'inscription",
      });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findByEmail(email);
      if (!user) return res.status(404).json({ message: "User not found" });

      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ message: "Mot de passe incorrect" });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ token });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Erreur de connexion" });
    }
  },

  async delete(req, res) {
    try {
      if (!req.headers.authorization) {
        return res.status(401).json({ message: "Token missing or invalid" });
      }
      const token = req.headers.authorization.split(" ")[1]; // "Bearer <token>"
      if (!token) {
        return res.status(401).json({ message: "Token missing or invalid" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await User.deleteById(decoded.id);

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "Error deleting user" });
    }
  },
};

module.exports = authController;
