import express from 'express'
import { addShow, getShow, getShows } from '../controllers/show.controller.js'
import { protectAdmin } from '../middleware/auth.js'

const router = express.Router()

router.post("/create", protectAdmin, addShow)
router.get("/all", getShows)
router.get("/:movieId", getShow)


export default router