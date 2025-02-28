const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = "your-secret-key"; // In production, use environment variable

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const createDbConnection = async () => {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // Add your MySQL password here
    database: "agorawin",
  });
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Authentication required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user;
    next();
  });
};

// Routes

// Auth routes
app.post("/api/auth/login", async (req, res) => {
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
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid credentials or account is inactive",
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

app.post("/api/auth/signup", async (req, res) => {
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
      return res
        .status(409)
        .json({
          success: false,
          message: "User with this phone number already exists",
        });
    }

    // Generate a random 4-digit PIN if not provided
    const finalPin = pin || Math.floor(1000 + Math.random() * 9000).toString();

    // Create new user
    const [result] = await connection.execute(
      "INSERT INTO users (phone, pin, branch, join_date) VALUES (?, ?, ?, NOW())",
      [phone, finalPin, branch],
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

// User routes
app.get("/api/users/profile", authenticateToken, async (req, res) => {
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

app.put("/api/users/update", authenticateToken, async (req, res) => {
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

app.delete("/api/users/delete", authenticateToken, async (req, res) => {
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

// Cards routes
app.get("/api/cards", authenticateToken, async (req, res) => {
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

app.post("/api/cards/activate", authenticateToken, async (req, res) => {
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

app.post("/api/cards/use", authenticateToken, async (req, res) => {
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
      return res
        .status(404)
        .json({
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

// Gifts routes
app.get("/api/gifts", authenticateToken, async (req, res) => {
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

app.post("/api/gifts/activate", authenticateToken, async (req, res) => {
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

app.post("/api/gifts/use", authenticateToken, async (req, res) => {
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
      return res
        .status(404)
        .json({
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

// Policy pages routes
app.get("/api/policy", async (req, res) => {
  try {
    const { slug } = req.query;

    if (!slug) {
      return res
        .status(400)
        .json({ success: false, message: "Slug is required" });
    }

    const connection = await createDbConnection();

    const [pages] = await connection.execute(
      "SELECT * FROM policy_pages WHERE slug = ?",
      [slug],
    );

    await connection.end();

    if (pages.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }

    res.json({ success: true, page: pages[0] });
  } catch (error) {
    console.error("Get policy page error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
