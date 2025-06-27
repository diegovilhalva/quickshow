import { clerkClient } from "@clerk/express"
import Booking from "../models/booking.model"
import Movie from "../models/movie.model.js"


export const getUserBookings = async (req, res) => {
    try {
        const user = req.auth().userId
        const bookings = await Booking.find({ user }).populate({
            path: "show",
            populate: { path: "movie" }
        }).sort({ createdAt: -1 })

        return res.status(200).json({ success: true, bookings })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Erro ao carregar reservas" })
    }
}



export const updateFavorite = async (res, res) => {
    try {
        const { movieId } = req.body
        const userId = req.auth().userId

        const user = await clerkClient.users.getUser(userId)

        if (!user.privateMetadata.favorites) {
            user.privateMetadata.favorites = []
        }

        if (!user.privateMetadata.favorites.includes(movieId)) {
            user.privateMetadata.favorites.push(movieId)
        } else {
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter((item) => item !== movieId)
        }

        await clerkClient.users.updateUserMetadata(userId, { privateMetadata: user.privateMetadata })

        return res.status(200).json({ success: true, message: "Favoritos atualizado com sucesso" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "erro ao adicionar ao favoritos" })
    }
}

export const getFavorites = async (req, res) => {
    try {
        const user = await clerkClient.users.getUser(req.auth().userId)
        const favorites = user.privateMetadata.favorites


        const movies = await Movie.find({ _id: { $in: favorites } })

        return res.status(200).json({ success: true, movies })
    } catch (error) {
        console.log(error)
        return res.status(200).json({ success: false, message: "Erro ao buscar favoritos" })
    }
}