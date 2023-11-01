const accountsPath = {
  "/accounts": {
    get: {
      tags: ["accounts"],
      summary: "Fetch all accounts",
      description: "",
      operationId: "getAccounts",
      produces: ["application/json", "application/xml"],
      parameters: [],
      responses: {
        200: {
          description: "success",
          schema: {
            type: "object",
            properties: {
              id: { type: "integer", default: 2 },
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
module.exports = accountsPath;
