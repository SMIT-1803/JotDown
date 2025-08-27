import { Router } from "express";
import { createNote, updateNote, tempDeleteNote, permanentDeleteNote } from "../controllers/notes.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

// secured routes
router.route("/create-note").post(verifyJWT,createNote)
router.route("/update-note").post(verifyJWT,updateNote)
router.route("/temp-delete-note").post(verifyJWT,tempDeleteNote)
router.route("/permanent-delete-note").post(verifyJWT,permanentDeleteNote)

export default router;