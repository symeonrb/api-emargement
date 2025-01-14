const request = require("supertest");
const app = require("./index");

const BASE_URL = "http://localhost:3000/api"; // Remplacez par l'URL de votre API si nécessaire

async function runTests() {
  try {
    // 1. Sign up a user (Formateur)
    await request(app)
      .post("/api/auth/signup")
      .send({
        email: "test@mail.com",
        password: "password123",
        name: "Formateur Test",
        role: "formateur",
      })
      .expect(201);
    console.log("Created user");

    // 2. Log in the user to get a JWT token
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@mail.com",
        password: "password123",
      })
      .expect(200);
    console.log("Logged in user");

    const token = loginResponse.body.token;

    // 3. Attempt to delete the user without being authenticated
    await request(app).delete("/api/auth/delete").expect(401);

    // 4. Delete the user with valid authentication
    await request(app)
      .delete("/api/auth/delete")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    console.log("Deleted user");

    await request(app).delete("/api/auth/delete").expect(401);

    // 2. Log in the deleted user
    await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@mail.com",
        password: "password123",
      })
      .expect(404);

    // 4. Delete the user with obsolete authentication
    await request(app)
      .delete("/api/auth/delete")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  } catch (error) {
    if (error.response) {
      console.error("Erreur de l'API :", error.response.data);
    } else {
      console.error("Erreur réseau ou autre :", error.message);
    }
  }
}

runTests();
