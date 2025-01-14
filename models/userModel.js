const db = require("../config/db");
const { z } = require("zod");

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(
    ["formateur", "etudiant"],
    'Role must be either "formateur" or "etudiant"'
  ),
});

const User = {
  async create(name, email, password, role) {
    const validationResult = userSchema.safeParse({
      name,
      email,
      password,
      role,
    });
    if (!validationResult.success) {
      throw new Error("Invalid data: " + validationResult.error.message);
    }

    const query =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(query, [name, email, password, role]);
    return result.insertId;
  },

  async deleteById(id) {
    const query = "DELETE FROM users WHERE id = ?";
    const [result] = await db.execute(query, [id]);
  },

  async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.execute(query, [email]);
    return rows[0];
  },

  async findById(id) {
    const query = "SELECT * FROM users WHERE id = ?";
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  },
};

module.exports = User;
