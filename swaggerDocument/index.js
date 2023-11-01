require("dotenv").config();
const swaggerPaths = require("./paths");
const swaggerTags = require("./tags.swagger");
const swaggerDefintions = require("./definitions.swagger");
const { swaggerInfo } = require("./info.swagger");
const swaggerDocument = {
  swagger: "2.0",
  info: swaggerInfo,
  host: process.env.HOST + ":" + process.env.PORT || 3001,
  basePath: "/api/v1",
  tags: [swaggerTags],
  schemes: ["https", "http"], // ["https", "http"]
  paths: swaggerPaths,
  securityDefinitions: {
    petstore_auth: {
      type: "oauth2",
      authorizationUrl: "http://petstore.swagger.io/oauth/dialog",
      flow: "implicit",
      scopes: {
        "write:pets": "modify pets in your account",
        "read:pets": "read your pets",
      },
    },
    api_key: {
      type: "apiKey",
      name: "api_key",
      in: "header",
    },
  },
  definitions: swaggerDefintions,
  externalDocs: {
    description: "Find out more about Swagger",
    url: "http://swagger.io",
  },
};

module.exports = swaggerDocument;
