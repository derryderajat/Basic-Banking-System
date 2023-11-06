const swaggerDefintions = {
  User: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
      },
      name: {
        type: "string",
      },
      email: {
        type: "string",
      },
    },
  },

  Profile: {
    type: "object",
    properties: {
      address: { type: "string" },
      identity_type: { type: "string" },
      identity_account_number: { type: "string" },
    },
  },
};
module.exports = swaggerDefintions;
