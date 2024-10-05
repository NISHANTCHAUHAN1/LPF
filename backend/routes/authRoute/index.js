import express from "express";
import {
  loginUser,
  register,
} from "../../controllers/authController/authCont.js";
import authenticate from "../../middleware/authmid.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", loginUser);

router.post("/chech-auth", authenticate, (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    data: {
      user,
    },
  });
});

export default router;
