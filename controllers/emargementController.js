const Emargement = require("../models/emargementModel");

const emargementController = {
  async markAttendance(req, res) {
    const session_id = req.params.id;
    const etudiant_id = req.user.id;
    const { status } = req.body;

    try {
      const attendanceId = await Emargement.markAttendance(
        session_id,
        etudiant_id,
        status
      );
      res.status(201).json({ message: "Présence enregistrée", attendanceId });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: "Erreur lors de l'émargement" });
    }
  },

  async getAttendanceBySession(req, res) {
    const session_id = req.params.id;

    try {
      const attendance = await Emargement.getAttendanceBySession(session_id);
      res.json(attendance);
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des émargements" });
    }
  },
};

module.exports = emargementController;
