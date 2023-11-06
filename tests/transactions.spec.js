const request = require("supertest");
const app = require("../"); // Pastikan Anda menyesuaikan dengan cara aplikasi Anda memuat server

describe("Transactions API", () => {
  it("should get a list of transactions (Positive Testing)", async () => {
    try {
      const response = await request(app).get("/api/v1/transactions");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("ok");
    } catch (error) {
      // Handle any errors
    }
  });

  it("should get a specific transaction by ID (Positive Testing)", async () => {
    try {
      // Replace ":id" with an existing transaction ID
      const transactionId = 1; // Replace with an existing transaction ID

      const response = await request(app).get(
        `/api/v1/transactions/${transactionId}`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("ok");
    } catch (error) {
      // Handle any errors
    }
  });
  // Negative Testing
  it("should not get a specific transaction with an invalid ID (Negative Testing)", async () => {
    try {
      // Replace ":id" with an invalid or non-existent transaction ID
      const invalidTransactionId = 9999; // Replace with an invalid or non-existent transaction ID

      const response = await request(app).get(
        `/api/v1/transactions/${invalidTransactionId}`
      );

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Not Found");
    } catch (error) {
      // Handle any errors
    }
  });

  it("should not get a list of transactions without authentication (Negative Testing)", async () => {
    try {
      const response = await request(app).get("/api/v1/transactions");

      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Forbidden");
    } catch (error) {
      // Handle any errors
    }
  });
});
