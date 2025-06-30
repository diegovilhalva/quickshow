import express from "express"
import { protectAdmin } from "../middleware/auth.js"
import { getAllBookings, getAllShows, getDashboardData, isAdmin } from "../controllers/admin.controller.js"

const router = express.Router()

router.get("/is-admin", protectAdmin, isAdmin)
router.get("/dashboard", protectAdmin, getDashboardData)
router.get("/all-shows", protectAdmin, getAllShows)
router.get("/all-bookings", protectAdmin,getAllBookings)
export default router