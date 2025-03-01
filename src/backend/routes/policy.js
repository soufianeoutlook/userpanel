const express = require("express");
const router = express.Router();
const { createDbConnection } = require("../db");

// Get policy page by slug
router.get("/", async (req, res) => {
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

module.exports = router;
