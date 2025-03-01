const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { createDbConnection } = require("../db");

// JWT Secret
const JWT_SECRET = "your-secret-key"; // In production, use environment variable

// Login route
router.post("/login", async (req, res) => {
  try {
    const { phone, pin } = req.body;

    if (!phone || !pin) {
      return res
        .status(400)
        .json({ success: false, message: "Phone and PIN are required" });
    }

    const connection = await createDbConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE phone = ? AND pin = ? AND is_active = 1",
      [phone, pin],
    );
    await connection.end();

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "بيانات الاعتماد غير صالحة أو الحساب غير نشط",
      });
    }

    const user = rows[0];
    const token = jwt.sign({ id: user.id, phone: user.phone }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        branch: user.branch,
        is_active: user.is_active === 1,
        join_date: user.join_date,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { phone, pin, branch = "01" } = req.body;

    if (!phone || !pin) {
      return res
        .status(400)
        .json({ success: false, message: "Phone and PIN are required" });
    }

    const connection = await createDbConnection();

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      "SELECT * FROM users WHERE phone = ?",
      [phone],
    );

    if (existingUsers.length > 0) {
      await connection.end();
      return res.status(409).json({
        success: false,
        message: "User with this phone number already exists",
      });
    }

    // Create new user
    const [result] = await connection.execute(
      "INSERT INTO users (phone, pin, branch, join_date) VALUES (?, ?, ?, NOW())",
      [phone, pin, branch],
    );

    const userId = result.insertId;

    // Get the created user
    const [newUsers] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [userId],
    );

    await connection.end();

    if (newUsers.length === 0) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to create user" });
    }

    const newUser = newUsers[0];
    const token = jwt.sign(
      { id: newUser.id, phone: newUser.phone },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name || "",
        phone: newUser.phone,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
