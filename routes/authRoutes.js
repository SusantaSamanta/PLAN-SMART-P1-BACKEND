import { Router } from "express";
import { postLogin, postRegister } from "../controllers/authController.js";
const router = Router();

router.post('/register', postRegister);
router.post('/login', postLogin);

export const authRoutes = router;


