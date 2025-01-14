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

  async updateSession(req, res) {
    // Ajoutez la logique de mise à jour ici
  },

  async deleteSession(req, res) {
    // Ajoutez la logique de suppression ici
  },
};

module.exports = sessionController;
