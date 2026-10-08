import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import profileRoutes from "../modules/profile/profile.routes.js";
import certificationRoutes from "../modules/certifications/certification.routes.js";
import goalRoutes from "../modules/goals/goal.routes.js";
import interestRoutes from "../modules/interests/interest.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/profile/certifications", certificationRoutes);
router.use("/goals", goalRoutes);
router.use("/interests", interestRoutes);

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Rovia API v1",
  });
});

export default router;
