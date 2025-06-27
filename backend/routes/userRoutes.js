import express from "express"
import {getFavorites, getUserBookings, updateFavorite}  from "../controllers/user.controller.js"

const router = express.Router()

router.get("/bookings",getUserBookings)
router.post("/updte-favorite",updateFavorite)
router.get("/favorites",getFavorites)

export default router