const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const connectDB = require("./src/config/database");

connectDB();

app.use(
  cors({
    origin: "https://simple-prack.netlify.app/",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/posts", require("./src/routes/postRoutes"));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
