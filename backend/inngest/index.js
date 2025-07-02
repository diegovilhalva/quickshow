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

const sendShowReminders = inngest.createFunction(
    { id: "send-show-reminders" },
    { cron: "0 */8 * * *" }, // Every 8 hours
    async ({ step }) => {
        const now = new Date();
        const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
        const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 1000);

        // Prepare reminder tasks
        const reminderTasks = await step.run("prepare-reminder-tasks", async () => {
            const shows = await Show.find({
                showTime: { $gte: windowStart, $lte: in8Hours },
            }).populate('movie');

            const tasks = [];

            for (const show of shows) {
                if (!show.movie || !show.occupiedSeats) continue;

                const userIds = [...new Set(Object.values(show.occupiedSeats))];
                if (userIds.length === 0) continue;

                const users = await User.find({ _id: { $in: userIds } }).select("name email");

                for (const user of users) {
                    tasks.push({
                        userEmail: user.email,
                        userName: user.name,
                        movieTitle: show.movie.title,
                        showTime: show.showTime,
                    })
                }
            }
            return tasks;
        })

        if (reminderTasks.length === 0) {
            return { sent: 0, message: "No reminders to send." }
        }

        // Send reminder emails
        const results = await step.run('send-all-reminders', async () => {
            return await Promise.allSettled(
                reminderTasks.map(task => sendEmail({
                    to: task.userEmail,
                    subject: `Lembrete: seu filme "${task.movieTitle}" será em breve!`,
                    body: `<div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Olá, ${task.userName}!</h2>
    <p>🎬 A sua sessão está chegando!</p>
    <h3 style="color: #F84565;">"${task.movieTitle}"</h3>
    <p>
        será exibido no dia <strong>${new Date(task.showTime).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</strong> às 
        <strong>${new Date(task.showTime).toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</strong>.
    </p>
    <p>⏰ Faltam cerca de <strong>8 horas</strong> para a sessão. Prepare a pipoca e venha curtir com a gente!</p>
    <br/>
    <p>Nos vemos na telona! 🍿<br/>Equipe QuickShow</p>
</div>`

                }))
            )
        })

        const sent = results.filter(r => r.status === "fulfilled").length;
        const failed = results.length - sent;

        return {
            sent,
            failed,
            message: `Sent ${sent} reminder(s), ${failed} failed.`
        }
    }
)

const sendNewShowNotifications = inngest.createFunction(
    { id: "send-new-show-notifications" },
    { event: "app/show.added" },
    async ({ event }) => {
        const { movieTitle } = event.data;

        const users = await User.find({})

        for (const user of users) {
            const userEmail = user.email;
            const userName = user.name;

            const subject = `🍿 Novo filme em cartaz: "${movieTitle}"`;
            const body = `<div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Olá, ${userName}!</h2>
    <p>Tem novidade quentinha chegando nas telonas! 🔥</p>
    <h3 style="color: #F84565;">"${movieTitle}"</h3>
    <p>acabou de entrar em cartaz na QuickShow, e você não vai querer perder essa estreia.</p>
    <p>🎟️ Garanta seu lugar agora mesmo e prepare-se para mais uma experiência incrível no cinema.</p>
    <br/>
    <p><a href="https://quickshow-ebon.vercel.app" style="color: #F84565; font-weight: bold;">Clique aqui para ver os horários e reservar</a></p>
    <br/>
    <p>Nos vemos no cinema!<br/>Equipe QuickShow 🎬</p>
</div>`;
            await sendEmail({
                to: userEmail,
                subject,
                body,
            })
        }

        return { message: "Notifications sent." }

    }
)

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdatation, releaseSeatsAndDeleteBooking, sendBookingConfirmationEmail, sendShowReminders,sendNewShowNotifications];