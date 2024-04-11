import { Router } from "express";
import {
  generateMessage,
} from "../controllers/chatController";

const router = Router();

router.post("/message", generateMessage);

export default router;
