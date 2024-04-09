import { Router } from "express";
import {
  generateActivationKey,
  activateKey,
} from "../controllers/activationController";

const router = Router();

router.post("/generate", generateActivationKey);
router.post("/activate", activateKey);

export default router;
