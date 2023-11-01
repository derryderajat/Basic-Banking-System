const express = require("express");
const app = express();
const router = require("./routes");
const { notFound } = require("./middleware/middleware");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swaggerDocument");
const swaggerJsdoc = require("swagger-jsdoc");
// port
require("dotenv").config();
const PORT = process.env.PORT || 3001;
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "LogRocket Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: process.env.HOST + `:${PORT}`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route
app.get("/", (req, res) => {
  res.json({ message: "Hey hoo" });
});
app.use("/api", router);
app.use(
  "/docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument, { explorer: true })
);
app.use(notFound);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
