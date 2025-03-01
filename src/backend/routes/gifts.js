const express = require("express");
const router = express.Router();
const { createDbConnection } = require("../db");
const { authenticateToken } = require("../middleware/auth");

// Get all gifts for the current user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const connection = await createDbConnection();

    // Get user's gift cards with details
    const [rows] = await connection.execute(
      `SELECT ugc.*, gc.* 
       FROM user_gift_cards ugc 
       JOIN gift_cards gc ON ugc.gift_card_id = gc.id 
       WHERE ugc.user_id = ?`,
      [userId],
    );

    await connection.end();

    // Format the response
    const gifts = rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      gift_card_id: row.gift_card_id,
      claim_date: row.claim_date,
      used_date: row.used_date,
      gift: {
        id: row.gift_card_id,
        name: row.name,
        serial_number: row.serial_number,
        description: row.description,
        type: row.type,
        usage_limit: row.usage_limit,
        validity_days: row.validity_days,
        status: row.status,
        expiry_date: row.expiry_date,
        created_at: row.created_at,
      },
    }));

    res.json({ success: true, gifts });
  } catch (error) {
    console.error("Get gifts error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Activate a new gift
router.post("/activate", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { serial_number } = req.body;

    if (!serial_number) {
      return res
        .status(400)
        .json({ success: false, message: "Gift serial number is required" });
    }

    const connection = await createDbConnection();

    // Check if gift exists and is unclaimed
    const [gifts] = await connection.execute(
      'SELECT * FROM gift_cards WHERE serial_number = ? AND status = "unclaimed"',
      [serial_number],
    );

    if (gifts.length === 0) {
      await connection.end();
      return res
        .status(404)
        .json({ success: false, message: "Gift not found or already claimed" });
    }

    const gift = gifts[0];

    // Claim gift for user
    await connection.execute(
      "INSERT INTO user_gift_cards (user_id, gift_card_id, claim_date) VALUES (?, ?, NOW())",
      [userId, gift.id],
    );

    // Update gift status
    await connection.execute(
      'UPDATE gift_cards SET status = "claimed" WHERE id = ?',
      [gift.id],
    );

    await connection.end();

    res.json({
      success: true,
      message: "Gift activated successfully",
      gift: {
        id: gift.id,
        name: gift.name,
        serial_number: gift.serial_number,
        description: gift.description,
        type: gift.type,
        usage_limit: gift.usage_limit,
        validity_days: gift.validity_days,
        status: "claimed",
        expiry_date: gift.expiry_date,
        created_at: gift.created_at,
      },
    });
  } catch (error) {
    console.error("Activate gift error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Use a gift
router.post("/use", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { gift_id } = req.body;

    if (!gift_id) {
      return res
        .status(400)
        .json({ success: false, message: "Gift ID is required" });
    }

    const connection = await createDbConnection();

    // Get user's gift
    const [userGifts] = await connection.execute(
      `SELECT ugc.*, gc.id as gift_card_id 
       FROM user_gift_cards ugc 
       JOIN gift_cards gc ON ugc.gift_card_id = gc.id 
       WHERE ugc.id = ? AND ugc.user_id = ? AND ugc.used_date IS NULL`,
      [gift_id, userId],
    );

    if (userGifts.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: "Gift not found, already used, or does not belong to user",
      });
    }

    const userGift = userGifts[0];

    // Mark gift as used
    await connection.execute(
      "UPDATE user_gift_cards SET used_date = NOW() WHERE id = ?",
      [gift_id],
    );

    // Update gift status
    await connection.execute(
      'UPDATE gift_cards SET status = "used" WHERE id = ?',
      [userGift.gift_card_id],
    );

    await connection.end();

    res.json({ success: true, message: "Gift used successfully" });
  } catch (error) {
    console.error("Use gift error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
