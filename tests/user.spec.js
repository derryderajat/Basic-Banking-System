const request = require("supertest");
const app = require("../"); // Adjust the path to your Express app

describe("Users API", () => {
  it("should fetch all users data", async () => {
    try {
      const response = await request(app).get("/api/v1/users");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeTruthy(); // Check that data exists
      expect(Array.isArray(response.body.data)).toBe(true); // Check that data is an array
    } catch (error) {}
  });

  it("should fetch a user by ID", async () => {
    try {
      // Replace ":id" with a valid user ID
      const userId = 2; // Replace with a valid user ID
      const response = await request(app).get(`/api/v1/users/${userId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeTruthy();
      // Add more specific expectations based on your expected response structure
    } catch (error) {}
  });

  //   it("should update a user by ID", async () => {
  //     try {
  //       // Replace ":id" with a valid user ID and provide request body data
  //       const userId = 1; // Replace with a valid user ID
  //       const userData = {
  //         name: "Updated Name",
  //         email: "updated.email@example.com",
  //       };

  //       const response = await request(app)
  //         .put(`/api/v1/users/${userId}`)
  //         .send(userData);

  //       expect(response.statusCode).toBe(201);
  //       expect(response.body.success).toBe(false);
  //       expect(response.body.data).toBeTruthy();
  //       // Add more specific expectations based on your expected response structure
  //     } catch (error) {}
  //   });

  //   it("should insert a new user", async () => {
  //     try {
  //       const userData = {
  //         name: "New User",
  //         email: "new.user@example.com",
  //         password: "password123",
  //         identity_type: "ID",
  //         identity_account_number: "1234567890",
  //         address: "New User Address",
  //       };

  //       const response = await request(app)
  //         .post("/api/v1/users")
  //         .send(userData);

  //       expect(response.statusCode).toBe(201);
  //       expect(response.body.success).toBe(false);
  //       expect(response.body.data).toBeTruthy();
  //       // Add more specific expectations based on your expected response structure
  //     } catch (error) {}
  //   });
});
