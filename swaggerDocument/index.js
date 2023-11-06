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
    bearer_token: {
      type: "apiKey",
      name: "Authorization",
      in: "Header",
      description:
        "Enter the token with the `Bearer: ` prefix, e.g. 'Bearer abcde12345'.",
    },
  },
  definitions: swaggerDefintions,
  externalDocs: {
    description: "Find out more about Swagger",
    url: "http://swagger.io",
  },
};

module.exports = swaggerDocument;
