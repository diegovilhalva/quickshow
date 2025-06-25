import express from 'express'
import { addShow } from '../controllers/show.controller.js'
import { protectAdmin } from '../middleware/auth.js'

const router = express.Router()

router.post("/create", protectAdmin, addShow)

export default router