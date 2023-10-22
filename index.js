const express = require("express");
const app = express();
const router = require("./routes");
// port
require("dotenv").config();
const PORT = process.env.PORT || 3001;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route
app.get("/", (req, res) => {
  res.json({ message: "Let's go" });
});
app.use("/api/v1", router);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
