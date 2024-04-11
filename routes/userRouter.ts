import { Router } from "express";
import {
    getUser
} from "../controllers/userController";

const router = Router();

router.get("/:machineId", getUser);

export default router;
