const transactionsPath = {
  "/transactions": {
    get: {
      tags: ["transactions"],
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
