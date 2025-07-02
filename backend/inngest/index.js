import { Inngest } from "inngest";
import User from "../models/user.model.js"
import Booking from "../models/booking.model.js";
import Show from "../models/show.model.js";
import sendEmail from "../config/node-mailer.js";
export const inngest = new Inngest({ id: "quick-show-tickets" });

const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            name: [first_name, last_name].filter(Boolean).join(" "),
            email: email_addresses[0]?.email_address,
            image: image_url
        }

        const existing = await User.findById(id)
        if (!existing) {
            await User.create(userData)
        } else {
            console.log(`Usuário com ID ${id} já existe. Nenhuma ação necessária.`);

        }
    }
)

const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-with-clerk' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { id } = event.data
        if (!id) {
            throw new Error("ID do usuário ausente no evento.")
        }
        await User.findByIdAndDelete(id)
        console.log(`Usuário com ID ${id} deletado com sucesso.`)
    }
)
const syncUserUpdatation = inngest.createFunction(
    { id: "update-user-from-clerk" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;

        const userData = {
            name: [first_name, last_name].filter(Boolean).join(" "),
            email: email_addresses[0]?.email_address,
            image: image_url,
        };

        await User.findByIdAndUpdate(id, userData, { new: true });
        console.log(`Usuário com ID ${id} atualizado com sucesso.`);
    }
);

const releaseSeatsAndDeleteBooking = inngest.createFunction(
    { id: 'release-seats-delete-booking' },
    { event: "app/checkpayment" },
    async ({ event, step }) => {
        const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000)
        await step.sleepUntil('wait-for-10-minutes', tenMinutesLater)

        await step.run('check-payment-status', async () => {
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId)


            if (!booking.isPaid) {
                const show = await Show.findById(booking.show);
                booking.bookedSeats.forEach((seat) => {
                    delete show.occupiedSeats[seat]
                });
                show.markModified('occupiedSeats')
                await show.save()
                await Booking.findByIdAndDelete(booking._id)
            }
        })
    }
)

const sendBookingConfirmationEmail = inngest.createFunction(
    { id: "send-booking-confirmation-email" },
    { event: "app/show.booked" },
    async ({ event, step }) => {
        const { bookingId } = event.data;

        const booking = await Booking.findById(bookingId).populate({
            path: 'show',
            populate: { path: "movie", model: "Movie" }
        }).populate('user');

        await sendEmail({
            to: booking.user.email,
            subject: `🎉 Ingresso confirmado: "${booking.show.movie.title}" te espera!`,
            body: `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2>Olá, ${booking.user.name}! 👋</h2>
        <p>Parabéns! Sua reserva para <strong style="color: #F84565;">"${booking.show.movie.title}"</strong> foi <strong>confirmada com sucesso</strong>! 🎟️</p>
        <p>
            <strong>Data:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}<br/>
            <strong>Horário:</strong> ${new Date(booking.show.showDateTime).toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
        </p>
        <p>Prepare a pipoca e aproveite cada momento da sessão! 🍿🎬</p>
        <p>Obrigado por escolher o <strong>QuickShow</strong>!<br/>Nos vemos no cinema! ✨</p>
    </div>`
        });

    }
)

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdatation, releaseSeatsAndDeleteBooking,sendBookingConfirmationEmail];