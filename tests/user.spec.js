const request = require("supertest");
const app = require("../"); // Adjust the path to your Express app

describe("Users API", () => {
  it("should fetch all users data", async () => {
    try {
      const response = await request(app).get("/api/v1/users");
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("ok");
      expect(response.body.data).toBeTruthy(); // Check that data exists
      expect(Array.isArray(response.body.data)).toBe(true); // Check that data is an array
      expect(response.body.totalRecords).toBeDefined();
      expect(response.body.pageNumber).toBeDefined();
      expect(response.body.totalPages).toBeDefined();
      expect(response.body.nextPage).toBeDefined();
      expect(response.body.prevPage).toBeDefined();
    } catch (error) {}
  });

  it("should fetch a user by ID", async () => {
    try {
      // Replace ":id" with a valid user ID
      const userId = 2; // Ganti dengan ID pengguna yang valid
      const response = await request(app).get(`/api/v1/users/${userId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("ok");
      expect(response.body.data).toBeTruthy();
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.name).toBeDefined();
      expect(response.body.data.email).toBeDefined();
      expect(response.body.data.profile).toBeDefined();
      expect(response.body.data.profile.user_id).toBeDefined();
      expect(response.body.data.profile.address).toBeDefined();
      expect(response.body.data.profile.identity_type).toBeDefined();
      expect(response.body.data.profile.identity_account_number).toBeDefined();
    } catch (error) {}
  });
  it("should insert a new user", async () => {
    try {
      const newUser = {
        name: "New User",
        email: "newuser@example.com",
        password: "newuserpassword",
        identity_type: "Passport",
        identity_account_number: "123456789",
        address: "New User Address",
      };

      const response = await request(app).post("/api/v1/users").send(newUser);

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Created");
      expect(response.body.data).toBeTruthy();

      expect(response.body.data.name).toBe(newUser.name);
      expect(response.body.data.email).toBe(newUser.email);
      expect(response.body.data.profile.identity_type).toBe(
        newUser.identity_type
      );
      expect(response.body.data.profile.identity_account_number).toBe(
        newUser.identity_account_number
      );
      expect(response.body.data.profile.address).toBe(newUser.address);
    } catch (error) {}
  });

  it("should update a user by ID", async () => {
    try {
      // Replace ":id" with a valid user ID
      const userId = 1; // Ganti dengan ID pengguna yang valid
      const updatedData = {
        name: "Updated User Name",
        email: "updateduser@example.com",
        identity_type: "Updated Passport",
        identity_account_number: "987654321",
        address: "Updated User Address",
      };

      const response = await request(app)
        .put(`/api/v1/users/${userId}`)
        .send(updatedData);

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Created");
      expect(response.body.data).toBeTruthy();

      expect(response.body.data.id).toBe(userId);
      expect(response.body.data.name).toBe(updatedData.name);
      expect(response.body.data.email).toBe(updatedData.email);
      expect(response.body.data.profile.identity_type).toBe(
        updatedData.identity_type
      );
      expect(response.body.data.profile.identity_account_number).toBe(
        updatedData.identity_account_number
      );
      expect(response.body.data.profile.address).toBe(updatedData.address);
    } catch (error) {}
  });
  
});

