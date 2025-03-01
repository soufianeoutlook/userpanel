const express = require("express");
const router = express.Router();
const { createDbConnection } = require("../db");
const { authenticateToken } = require("../middleware/auth");

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const connection = await createDbConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [userId],
    );
    await connection.end();

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = rows[0];
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
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update user profile
router.put("/update", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, current_pin, new_pin } = req.body;

    const connection = await createDbConnection();

    // If updating PIN, verify current PIN
    if (current_pin && new_pin) {
      const [pinCheck] = await connection.execute(
        "SELECT * FROM users WHERE id = ? AND pin = ?",
        [userId, current_pin],
      );

      if (pinCheck.length === 0) {
        await connection.end();
        return res
          .status(401)
          .json({ success: false, message: "Current PIN is incorrect" });
      }

      // Update PIN
      await connection.execute("UPDATE users SET pin = ? WHERE id = ?", [
        new_pin,
        userId,
      ]);

      await connection.end();
      return res.json({ success: true, message: "PIN updated successfully" });
    }

    // Update profile information
    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }

    if (email) {
      updateFields.push("email = ?");
      updateValues.push(email);
    }

    if (updateFields.length === 0) {
      await connection.end();
      return res
        .status(400)
        .json({ success: false, message: "No fields to update" });
    }

    updateValues.push(userId);

    await connection.execute(
      `UPDATE users SET ${updateFields.join(", ")}, updated_at = NOW() WHERE id = ?`,
      updateValues,
    );

    // Get updated user
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [userId],
    );

    await connection.end();

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = rows[0];
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
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete user account
router.delete("/delete", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const connection = await createDbConnection();

    // Soft delete by setting is_active to 0
    await connection.execute(
      "UPDATE users SET is_active = 0, updated_at = NOW() WHERE id = ?",
      [userId],
    );

    await connection.end();

    res.json({ success: true, message: "Account deactivated successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
