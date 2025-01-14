const Session = require("../models/sessionModel");

const sessionController = {
  async createSession(req, res) {
    const { title, date } = req.body;
    const formateur_id = req.user.id;

    try {
      const sessionId = await Session.create(title, date, formateur_id);
      res.status(201).json({ message: "Session créée", sessionId });
    } catch (error) {
      console.log(error.message);
      res
        .status(400)
        .json({ error: "Erreur lors de la création de la session" });
    }
  },

  async getAllSessions(req, res) {
    try {
      const sessions = await Session.getAll();
      res.json(sessions);
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des sessions" });
    }
  },

  async getSessionById(req, res) {
    try {
      const session = await Session.getById(req.params.id);
      if (!session)
        return res.status(404).json({ error: "Session introuvable" });
      res.json(session);
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération de la session" });
    }
  },

  async deleteSession(req, res) {
    try {
      const sessionId = req.params.id;
      const session = await Session.getById(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session introuvable" });
      }

      // Check if the user is the formateur who created the session
      const auth_id = req.user.id; // Assuming the formateur_id comes from the JWT
      if (session.formateur_id !== auth_id) {
        return res.status(403).json({
          error: "Vous n'êtes pas autorisé à supprimer cette session",
        });
      }

      await Session.deleteById(sessionId);
      res.status(200).json({ message: "Session supprimée avec succès" });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression de la session" });
    }
  },
};

module.exports = sessionController;
