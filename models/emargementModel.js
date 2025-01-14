const db = require("../config/db");
const { z } = require("zod");

const emargementSchema = z.object({
  status: z.boolean(),
  session_id: z
    .number()
    .int()
    .positive("Session ID must be a positive integer"),
  etudiant_id: z
    .number()
    .int()
    .positive("Etudiant ID must be a positive integer"),
});

const Emargement = {
  async markAttendance(session_id, etudiant_id, status) {
    const validationResult = emargementSchema.safeParse({
      session_id,
      etudiant_id,
      status,
    });
    if (!validationResult.success) {
      throw new Error("Invalid data: " + validationResult.error.message);
    }

    const query =
      "INSERT INTO emargements (session_id, etudiant_id, status) VALUES (?, ?, ?)";
    const [result] = await db.execute(query, [session_id, etudiant_id, status]);
    return result.insertId;
  },

  async getAttendanceBySession(session_id) {
    const query = "SELECT * FROM emargements WHERE session_id = ?";
    const [rows] = await db.execute(query, [session_id]);
    return rows;
  },

  async getAttendanceByStudent(etudiant_id) {
    const query = "SELECT * FROM emargements WHERE etudiant_id = ?";
    const [rows] = await db.execute(query, [etudiant_id]);
    return rows;
  },
};

module.exports = Emargement;
