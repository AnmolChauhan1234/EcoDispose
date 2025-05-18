import express from "express";
import dotenv from "dotenv";
import mlRoute from "./routes/mlRoute.js";
import cors from "cors";

dotenv.config({ path: "./env" });

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Use ML route
app.use("/api", mlRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
