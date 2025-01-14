const express = require("express");
const authController = require("../controllers/authController");
const sessionController = require("../controllers/sessionController");
const emargementController = require("../controllers/emargementController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Gestion des utilisateurs
router.post("/auth/signup", authController.signup);
router.post("/auth/login", authController.login);
router.delete("/auth/delete", authController.delete);

// Gestion des sessions de cours
router.post(
  "/sessions",
  authMiddleware.verifyToken,
  authMiddleware.isFormateur,
  sessionController.createSession
);
router.get(
  "/sessions",
  authMiddleware.verifyToken,
  sessionController.getAllSessions
);
router.get(
  "/sessions/:id",
  authMiddleware.verifyToken,
  sessionController.getSessionById
);
router.delete(
  "/sessions/:id",
  authMiddleware.verifyToken,
  authMiddleware.isFormateur,
  sessionController.deleteSession
);

// Gestion des émargements
router.post(
  "/sessions/:id/emargement",
  authMiddleware.verifyToken,
  authMiddleware.isEtudiant,
  emargementController.markAttendance
);
router.get(
  "/sessions/:id/emargement",
  authMiddleware.verifyToken,
  authMiddleware.isFormateur,
  emargementController.getAttendanceBySession
);

module.exports = router;
