import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import profileRoutes from "../modules/profile/profile.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Rovia API v1",
  });
});

export default router;
