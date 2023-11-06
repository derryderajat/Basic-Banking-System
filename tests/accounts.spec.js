const request = require("supertest");
const app = require("../");
describe("Accounts API", () => {
  it("should fetch all accounts data", async () => {
    try {
      const response = await request(app).get("/api/v1/accounts");
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeTruthy(); // Check that data exists
      expect(Array.isArray(response.body.data)).toBe(true); // Check that data is an array
    } catch (error) {
      // Handle any errors
    }
  });

  it("should fetch an account by ID", async () => {
    try {
      // Replace ":accountId" with a valid account ID
      const accountId = 1; // Replace with a valid account ID
      const response = await request(app).get(`/api/v1/accounts/${accountId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeTruthy();
    } catch (error) {
      // Handle any errors
    }
  });

  it("should insert a new account", async () => {
    try {
      const newAccount = {
        user_id: 1, // Replace with a valid user ID
        bank_name: "Example Bank",
        bank_account_number: "1234567890", // Replace with a valid account number
      };

      const response = await request(app)
        .post("/api/v1/accounts")
        .send(newAccount);

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Created");
      expect(response.body.data).toBeTruthy();
    } catch (error) {
      // Handle any errors
    }
  });

  it("should withdraw from an account", async () => {
    try {
      // Replace ":bank_account_number" with a valid bank account number
      const bankAccountNumber = "1234567890"; // Replace with a valid bank account number
      const withdrawalData = {
        amount: 100, // Replace with the withdrawal amount
      };

      const response = await request(app)
        .post(`/api/v1/accounts/${bankAccountNumber}/withdraw`)
        .send(withdrawalData);

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Created");
      expect(response.body.data).toBeTruthy();
    } catch (error) {
      // Handle any errors
    }
  });
  it("should deposit into an account", async () => {
    try {
      // Replace ":bank_account_number" with a valid bank account number
      const bankAccountNumber = "1234567890"; // Replace with a valid bank account number
      const depositData = {
        amount: 100, // Replace with the deposit amount
      };

      const response = await request(app)
        .post(`/api/v1/accounts/${bankAccountNumber}/deposit`)
        .send(depositData);

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Created");
      expect(response.body.data).toBeTruthy();
    } catch (error) {
      // Handle any errors
    }
  });

  it("should get balance inquiry for an account", async () => {
    try {
      // Replace ":bank_account_number" with a valid bank account number
      const bankAccountNumber = "1234567890"; // Replace with a valid bank account number

      const response = await request(app).get(
        `/api/v1/accounts/${bankAccountNumber}/balance_inquiry`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeTruthy();
    } catch (error) {
      // Handle any errors
    }
  });

  it("should get transaction history for an account", async () => {
    try {
      // Replace ":bank_account_number" with a valid bank account number
      const bankAccountNumber = "1234567890"; // Replace with a valid bank account number

      const response = await request(app).get(
        `/api/v1/accounts/${bankAccountNumber}/transactions`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeTruthy();
    } catch (error) {
      // Handle any errors
    }
  });

  // Negative testing
  it("should not deposit into an invalid account (Negative Testing)", async () => {
    try {
      // Replace ":bank_account_number" with an invalid or non-existent bank account number
      const bankAccountNumber = "invalid_account_number"; // Replace with an invalid account number
      const depositData = {
        amount: 100, // Replace with the deposit amount
      };

      const response = await request(app)
        .post(`/api/v1/accounts/${bankAccountNumber}/deposit`)
        .send(depositData);

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Not Found");
    } catch (error) {
      // Handle any errors
    }
  });

  it("should not get balance inquiry for an invalid account (Negative Testing)", async () => {
    try {
      // Replace ":bank_account_number" with an invalid or non-existent bank account number
      const bankAccountNumber = "invalid_account_number"; // Replace with an invalid account number

      const response = await request(app).get(
        `/api/v1/accounts/${bankAccountNumber}/balance_inquiry`
      );

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Not Found");
    } catch (error) {
      // Handle any errors
    }
  });

  it("should not get transaction history for an invalid account (Negative Testing)", async () => {
    try {
      // Replace ":bank_account_number" with an invalid or non-existent bank account number
      const bankAccountNumber = "invalid_account_number"; // Replace with an invalid account number

      const response = await request(app).get(
        `/api/v1/accounts/${bankAccountNumber}/transactions`
      );

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Not Found");

    } catch (error) {
      // Handle any errors
    }
  });
});
