const usersPath = {
  "/users": {
    get: {
      security: [{ bearer_token: [] }],
      tags: ["users"],
      summary: "Fetch all users",
      description: "",
      parameters: [
        {
          name: "page",
          in: "path",
          description: "page values that need to be considered for pagination",
          required: false,
          type: "integer",
        },
      ],
      operationId: "getUser",
      produces: ["application/json", "application/xml"],
      responses: {
        200: {
          description: "success",
          schema: {
            type: "object", // Change the type to "object"
            properties: {
              data: {
                type: "object",
                properties: {
                  users: {
                    type: "array",
                    items: {
                      $ref: "#/definitions/User",
                      $ref: "#/definitions/User",
                    },
                  },
                  totalRecords: {
                    type: "integer",
                    default: 1,
                  },
                  pageNumber: {
                    type: "integer",
                    default: 1,
                  },
                  totalPages: {
                    type: "integer",
                    default: 1,
                  },
                  nextPage: {
                    type: "integer",
                    default: null,
                  },
                  prevPage: {
                    type: "integer",
                    default: null,
                  },
                },
              },
              message: {
                type: "string",
                default: "success",
              },
              error: {
                type: "string",
                default: null,
              },
              success: {
                type: "string",
                default: "ok",
              },
            },
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
                data: null,
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
  "/users/{id}": {
    get: {
      tags: ["users"],
      summary: "Get user by id",
      description: "",
      security: [{ bearer_token: [] }],
      operationId: "getUserById",
      produces: ["application/json", "application/xml"],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Id values that need to be considered for filter",
          required: true,
          type: "integer",
        },
      ],
      responses: {
        200: {
          description: "success",

          schema: {
            $ref: "#/definitions/User",
            properties: {
              profile: {
                $ref: "#/definitions/Profile",
              },
            },
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
      },
    },
    put: {
      tags: ["users"],
      summary: "Modify data user",
      description:
        "This operation allows you to modify user data by providing updated information.",
      operationId: "updateUser",
      produces: ["application/json", "application/xml"],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Id values that need to be considered for certain user",
          required: true,
          type: "integer",
        },
        {
          name: "body",
          in: "body",
          description: "updated user object",
          required: true,
          schema: {
            $ref: "#/definitions/User",
            properties: {
              profile: {
                $ref: "#/definitions/Profile",
              },
            },
          },
        },
      ],
      responses: {
        201: {
          description: "created",
        },
        400: {
          description: "Bad Request",
        },
      },
    },
  },
};
module.exports = usersPath;
