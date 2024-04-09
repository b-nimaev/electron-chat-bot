import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import activationRoutes from "./routes/activationRoutes";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/" + process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Routes
app.use("/api/activation", activationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
