const jwt = require("jsonwebtoken");

const authMiddleware = {
  verifyToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ error: "Token manquant" });

    try {
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: "Token invalide" });
    }
  },

  isFormateur(req, res, next) {
    if (req.user.role !== "formateur") {
      return res.status(403).json({ error: "Accès réservé aux formateurs" });
    }
    next();
  },

  isEtudiant(req, res, next) {
    if (req.user.role !== "etudiant") {
      return res.status(403).json({ error: "Accès réservé aux étudiants" });
    }
    next();
  },
};

module.exports = authMiddleware;
