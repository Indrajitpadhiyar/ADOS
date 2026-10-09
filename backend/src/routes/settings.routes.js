import { Router } from "express";
import { SettingsController } from "../controllers/settings.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", SettingsController.getSettings);
router.put("/", SettingsController.updateSettings);
router.post("/regenerate-api-key", SettingsController.regenerateApiKey);

export default router;
