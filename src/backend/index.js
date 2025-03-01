const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const cardRoutes = require("./routes/cards");
const giftRoutes = require("./routes/gifts");
const policyRoutes = require("./routes/policy");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/gifts", giftRoutes);
app.use("/api/policy", policyRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
