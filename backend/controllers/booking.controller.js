import Booking from "../models/booking.model.js"
import Show from "../models/show.model.js"

export const checkSeatsAvailiability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId)
        if (!showData) return false

        const occupiedSeats = showData.occupiedSeats

        const isAnySeatTaken = selectedSeats.some((seat) => occupiedSeats[seat])


        return !isAnySeatTaken


    } catch (error) {
        console.log(error)
        throw new Error("Erro ao verificar assentos")
    }
}


export const createBooking = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { showId, selectedSeats } = req.body
        const { origin } = req.headers

        const isAvailable = await checkSeatsAvailiability(showId, selectedSeats)

        if (!isAvailable) {
            return res.status(400).json({ success: false, message: "Assentos indisponíveis" })
        }

        const showData = await Show.findById(showId).populate('movie')

        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        })

        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId
        })

        showData.markModified('occupiedSeats')

        await showData.save()

        // To do iniciar gateway de pagamento com Stripe

        return res.status(201).json({ success: true, message: "Reservado com sucesso!" })


    } catch (error) {
        console.log(error)
        return res.status(500).json({ sucess: false, message: "Ocorreu um erro ao tentar ao criar reserva" })
    }
}


export const getOccupiedSeats = async (req, res) => {
    try {


        const { showId } = req.params
        const showData = await Show.findById(showId)

        const occupiedSeats = Object.keys(showData.occupiedSeats)

        res.status(200).json({ sucess: true, occupiedSeats })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Ocorreu ao tentar encontrar assento"
        })
    }
}
