import { Router } from "express";
import { TeamController } from "../controllers/team.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", TeamController.getTeam);
router.post("/", TeamController.inviteMember);
router.patch("/:id", TeamController.updateMember);
router.delete("/:id", TeamController.removeMember);

export default router;
