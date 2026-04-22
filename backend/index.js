const express = require("express");
const cors = require("cors");          
require("dotenv").config();          

const app = express();
const connectDB = require("./src/config/database");

connectDB();

app.use(cors({
  origin: "http://localhost:5173",     
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/posts", require("./src/routes/postRoutes"));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});