const request = require("supertest");
const app = require("../index");

// Store the tokens for authentication in later requests
let teacherToken = null;
let studentToken = null;

// Use Jest's lifecycle hooks to set up and tear down tests
beforeAll(async () => {
  // 1. Sign up a user (Teacher)
  try {
    await request(app)
      .post("/api/auth/signup")
      .send({
        email: "teacher@mail.com",
        password: "password123",
        name: "Teacher Test",
        role: "formateur",
      })
      .expect(201);
    console.log("Created formateur");
  } catch (error) {}

  // 2. Log in the user to get a JWT token
  const teacherLoginResponse = await request(app)
    .post("/api/auth/login")
    .send({
      email: "teacher@mail.com",
      password: "password123",
    })
    .expect(200);
  console.log("Logged in formateur");

  teacherToken = teacherLoginResponse.body.token;

  // 3. Sign up a user (Student)
  try {
    await request(app)
      .post("/api/auth/signup")
      .send({
        email: "student@mail.com",
        password: "password123",
        name: "Student Test",
        role: "etudiant",
      })
      .expect(201);
    console.log("Created student");
  } catch (error) {}

  // 4. Log in the user to get a JWT token
  const studentLoginResponse = await request(app)
    .post("/api/auth/login")
    .send({
      email: "student@mail.com",
      password: "password123",
    })
    .expect(200);
  console.log("Logged in student");

  studentToken = studentLoginResponse.body.token;
});

afterAll(async () => {
  // Clean up: delete the users
  if (teacherToken) {
    try {
      await request(app)
        .delete("/api/auth/delete")
        .set("Authorization", `Bearer ${teacherToken}`)
        .expect(200);
      console.log("Deleted teacher");
    } catch (error) {}
  }
  if (studentToken) {
    try {
      await request(app)
        .delete("/api/auth/delete")
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(200);
      console.log("Deleted student");
    } catch (error) {}
  }
});

describe("Auth API tests", () => {
  // Session
  it("should create a session for the formateur", async () => {
    const response = await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        title: "Cours Node.js",
        date: "2025-01-20",
      })
      .expect(201);

    sessionId = response.body.sessionId;
    expect(response.body.message).toBe("Session créée");
  });

  it("should not allow an étudiant to create a session", async () => {
    const response = await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        title: "Cours React.js",
        date: "2025-01-21",
      })
      .expect(403);

    expect(response.body.error).toBe("Accès réservé aux formateurs");
  });

  it("should not allow a student to delete a session", async () => {
    const response = await request(app)
      .delete(`/api/sessions/${sessionId}`)
      .set("Authorization", `Bearer ${studentToken}`)
      .expect(403);

    expect(response.body.error).toBe("Accès réservé aux formateurs");
  });

  it("should allow the teacher to delete their own session", async () => {
    const response = await request(app)
      .delete(`/api/sessions/${sessionId}`)
      .set("Authorization", `Bearer ${teacherToken}`)
      .expect(200);

    expect(response.body.message).toBe("Session supprimée avec succès");
  });

  // User account deletion
  it("should not allow user deletion without authentication", async () => {
    const response = await request(app).delete("/api/auth/delete").expect(401);
    expect(response.body.message).toBe("Token missing or invalid");
  });

  it("should delete the user with valid authentication", async () => {
    const response = await request(app)
      .delete("/api/auth/delete")
      .set("Authorization", `Bearer ${teacherToken}`)
      .expect(200);
    expect(response.body.message).toBe("User deleted successfully");
    console.log("Deleted teacher");
  });

  it("should return 401 when trying to delete already deleted user", async () => {
    const response = await request(app)
      .delete("/api/auth/delete")
      .set("Authorization", `Bearer ${teacherToken}`)
      .expect(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should not log in a deleted user", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "teacher@mail.com",
        password: "password123",
      })
      .expect(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should return 404 when trying to delete with obsolete authentication", async () => {
    const response = await request(app)
      .delete("/api/auth/delete")
      .set("Authorization", `Bearer ${teacherToken}`)
      .expect(404);
    expect(response.body.message).toBe("User not found");
  });
});
