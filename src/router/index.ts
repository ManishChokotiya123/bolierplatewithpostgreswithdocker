import { Request, Response, Router } from "express";
import {
  showUser,
  createUser,
  findbyId,
  userUpdate,
  userDelete,
  userLogin,
  userChangePassword
} from "../controller/index";
const router = Router();

router.get("/users", showUser);

router.post("/createUser", createUser);

router.get("/user/:id", findbyId);

router.post("/user/update/:id", userUpdate);

router.delete("/user/delete/:id", userDelete);

router.post("/user/login", userLogin);

router.get("/user/changePassword/:email", userChangePassword)

export default router;
