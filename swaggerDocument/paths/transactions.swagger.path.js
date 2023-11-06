const transactionsPath = {
  "/transactions": {
    get: {
      tags: ["transactions"],
      security: [{ bearer_token: [] }],
      summary: "Fetch all transactions",
      description: "",
      operationId: "getTransactions",
      produces: ["application/xml", "application/json"],
      parameters: [],
      responses: {
        200: {
          description: "success",
          schema: {
            $ref: "#/definitions/User",
          },
        },
        403: {
          description: "Forbidden action",
          schema: {
            $ref: "#/definitions/User",
          },
          examples: {
            "application/json": {
              data: null,
              message: "Forbidden",
              error: "You are not allow in here",
              success: false,
            },
          },
        },
        404: {
          description: "Not Found",
          schema: {
            $ref: "#/definitions/User",
          },
          examples: {
            "application/json": {
              data: {
                users: [],
                totalRecords: 0,
                pageNumber: 1,
                totalPages: 1,
                nextPage: null,
                prevPage: null,
              },
              message: "Data is not found",
              error: null,
              status: "Not Found",
            },
          },
        },
      },
    },
  },
};
module.exports = transactionsPath;
