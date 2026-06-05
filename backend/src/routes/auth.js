import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/auth/me — returns authenticated user info from Supabase JWT
router.get("/me", requireAuth, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    created_at: req.user.created_at,
    account_type: req.user.user_metadata?.account_type || "b2c",
  });
});

export default router;
