import Booking from "../models/booking.model.js"
import Show from "../models/show.model.js"
import stripe from "stripe"

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

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

        const lineItems = [{
            price_data: {
                currency: 'brl',
                product_data: {
                    name: showData.movie.title
                },
                unit_amout: Math.floor(booking.amount) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions({
            success_url: `${origin}/loading/my-bookings`,
            cancel_url: `${oringin}/my-boolings`,
            line_items: lineItems,
            mode: 'payment',
            metadata: {
                bookingId: booking._id.toString()
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60
        })

        booking.paymentLink = session.url

        await booking.save()

        return res.status(201).json({ success: true, url: session.url })


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

        res.status(200).json({ success: true, occupiedSeats })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Ocorreu ao tentar encontrar assento"
        })
    }
}
