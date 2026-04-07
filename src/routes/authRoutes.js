import express from "express";
import { register, login } from '../controllers/authController.js';
import { validateRequest } from "../middleware/validateRequest.js";
import { loginSchema, regiserSchema } from "../validators/authValidator.js";
const router = express.Router();

router.post("/register", validateRequest(regiserSchema), register);
router.post("/login", validateRequest(loginSchema), login)

export default router;
