const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/database");

const app = express();

app.use(
  cors({
    origin: ["https://simple-practice.netlify.app"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/posts", require("./src/routes/postRoutes"));

const startServer = async () => {
  try {
    await connectDB(); 

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });

  } catch (error) {
    console.error(" Failed to connect DB:", error);
    process.exit(1); 
  }
};

startServer();
