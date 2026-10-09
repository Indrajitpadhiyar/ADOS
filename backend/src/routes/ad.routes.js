import { Router } from "express";
import { AdController } from "../controllers/ad.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all ad endpoints
router.use(authenticate);

router.get("/", AdController.getAds);
router.get("/stats", AdController.getStats);
router.post("/", AdController.createAd);
router.patch("/:id/status", AdController.toggleStatus);
router.patch("/:id", AdController.updateAd);
router.delete("/:id", AdController.deleteAd);

export default router;
