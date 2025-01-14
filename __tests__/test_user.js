const request = require("supertest");
const app = require("../index");

let token = null; // Store the token for authentication in later requests

// Use Jest's lifecycle hooks to set up and tear down tests
beforeAll(async () => {
  // 1. Sign up a user (Formateur)
  const signupResponse = await request(app)
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

  token = loginResponse.body.token;
});

afterAll(async () => {
  // Clean up: delete the user
  if (token) {
    try {
      await request(app)
        .delete("/api/auth/delete")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      console.log("Deleted user");
    } catch (error) {}
  }
});

describe("Auth API tests", () => {
  // User
  it("should not allow user deletion without authentication", async () => {
    const response = await request(app).delete("/api/auth/delete").expect(401);
    expect(response.body.message).toBe("Token missing or invalid");
  });

  it("should delete the user with valid authentication", async () => {
    const response = await request(app)
      .delete("/api/auth/delete")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(response.body.message).toBe("User deleted successfully");
  });

  it("should return 401 when trying to delete already deleted user", async () => {
    const response = await request(app)
      .delete("/api/auth/delete")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should not log in a deleted user", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@mail.com",
        password: "password123",
      })
      .expect(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should return 404 when trying to delete with obsolete authentication", async () => {
    const response = await request(app)
      .delete("/api/auth/delete")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
    expect(response.body.message).toBe("User not found");
  });
});
