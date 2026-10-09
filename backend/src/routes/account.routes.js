import { Router } from "express";
import { AccountController } from "../controllers/account.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", AccountController.getAccounts);
router.post("/", AccountController.connectAccount);
router.patch("/:id", AccountController.updateAccount);
router.delete("/:id", AccountController.disconnectAccount);

export default router;
