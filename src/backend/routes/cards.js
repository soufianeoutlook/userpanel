const express = require("express");
const router = express.Router();
const { createDbConnection } = require("../db");
const { authenticateToken } = require("../middleware/auth");

// Get all cards for the current user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const connection = await createDbConnection();

    // Get user's stamp cards with details
    const [rows] = await connection.execute(
      `SELECT usc.*, sc.* 
       FROM user_stamp_cards usc 
       JOIN stamp_cards sc ON usc.stamp_card_id = sc.id 
       WHERE usc.user_id = ?`,
      [userId],
    );

    await connection.end();

    // Format the response
    const cards = rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      stamp_card_id: row.stamp_card_id,
      current_stamps: row.current_stamps,
      activation_date: row.activation_date,
      card: {
        id: row.stamp_card_id,
        name: row.name,
        serial_number: row.serial_number,
        description: row.description,
        image_url: row.image_url,
        total_stamps: row.total_stamps,
        status: row.status,
        created_at: row.created_at,
      },
    }));

    res.json({ success: true, cards });
  } catch (error) {
    console.error("Get cards error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Activate a new card
router.post("/activate", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { serial_number } = req.body;

    if (!serial_number) {
      return res
        .status(400)
        .json({ success: false, message: "Card serial number is required" });
    }

    const connection = await createDbConnection();

    // Check if card exists and is active
    const [cards] = await connection.execute(
      'SELECT * FROM stamp_cards WHERE serial_number = ? AND status = "active"',
      [serial_number],
    );

    if (cards.length === 0) {
      await connection.end();
      return res
        .status(404)
        .json({ success: false, message: "Card not found or inactive" });
    }

    const card = cards[0];

    // Check if user already has this card
    const [existingCards] = await connection.execute(
      "SELECT * FROM user_stamp_cards WHERE user_id = ? AND stamp_card_id = ?",
      [userId, card.id],
    );

    if (existingCards.length > 0) {
      await connection.end();
      return res
        .status(409)
        .json({ success: false, message: "You already have this card" });
    }

    // Activate card for user
    await connection.execute(
      "INSERT INTO user_stamp_cards (user_id, stamp_card_id, current_stamps, activation_date) VALUES (?, ?, 0, NOW())",
      [userId, card.id],
    );

    await connection.end();

    res.json({
      success: true,
      message: "Card activated successfully",
      card: {
        id: card.id,
        name: card.name,
        serial_number: card.serial_number,
        description: card.description,
        image_url: card.image_url,
        total_stamps: card.total_stamps,
        status: card.status,
        created_at: card.created_at,
        current_stamps: 0,
      },
    });
  } catch (error) {
    console.error("Activate card error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Use a card (increment stamps)
router.post("/use", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { card_id } = req.body;

    if (!card_id) {
      return res
        .status(400)
        .json({ success: false, message: "Card ID is required" });
    }

    const connection = await createDbConnection();

    // Get user's card
    const [userCards] = await connection.execute(
      `SELECT usc.*, sc.total_stamps 
       FROM user_stamp_cards usc 
       JOIN stamp_cards sc ON usc.stamp_card_id = sc.id 
       WHERE usc.id = ? AND usc.user_id = ?`,
      [card_id, userId],
    );

    if (userCards.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: "Card not found or does not belong to user",
      });
    }

    const userCard = userCards[0];

    // Check if card is already full
    if (userCard.current_stamps >= userCard.total_stamps) {
      await connection.end();
      return res
        .status(400)
        .json({ success: false, message: "Card is already full" });
    }

    // Increment stamps
    await connection.execute(
      "UPDATE user_stamp_cards SET current_stamps = current_stamps + 1 WHERE id = ?",
      [card_id],
    );

    await connection.end();

    res.json({ success: true, message: "Stamp added successfully" });
  } catch (error) {
    console.error("Use card error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
