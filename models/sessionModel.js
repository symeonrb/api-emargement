const db = require("../config/db");
const { z } = require("zod");

const sessionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
  formateur_id: z
    .number()
    .int()
    .positive("Formateur ID must be a positive integer"),
});

const Session = {
  async create(title, date, formateur_id) {
    const validationResult = sessionSchema.safeParse({
      title,
      date,
      formateur_id,
    });
    if (!validationResult.success) {
      throw new Error("Invalid data: " + validationResult.error.message);
    }

    const query =
      "INSERT INTO sessions (title, date, formateur_id) VALUES (?, ?, ?)";
    const [result] = await db.execute(query, [title, date, formateur_id]);
    return result.insertId;
  },

  async getAll() {
    const query = "SELECT * FROM sessions";
    const [rows] = await db.execute(query);
    return rows;
  },

  async getById(id) {
    const query = "SELECT * FROM sessions WHERE id = ?";
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  },
};

module.exports = Session;
