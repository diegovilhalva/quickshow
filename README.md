
# 🎬 QuickShow

QuickShow is a dynamic and feature-rich movie ticket booking web application built with the **MERN Stack**, **Tailwind CSS**, and several modern tools like **Inngest**, **Brevo**, **Clerk**, and the **TMDB API**. Although the app is written in Portuguese 🇧🇷, it is structured and scalable for any language and region.

🌐 **Live Demo**: [quickshow-ebon.vercel.app](https://quickshow-ebon.vercel.app)  
📂 **GitHub Repo**: [github.com/diegovilhalva/quickshow](https://github.com/diegovilhalva/quickshow)

---

## ⚙️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Clerk Auth
- **Backend**: Express.js + MongoDB + Mongoose
- **Email Service**: Nodemailer + Brevo SMTP
- **Background Jobs**: Inngest
- **Payment Integration**: Stripe
- **Movie Data**: TMDB API
- **Deployment**: Vercel (frontend) & Railway (backend or similar)

---

## 📁 Project Structure

```

quickshow/
├── backend/       → Node.js + Express server
├── frontend/      → React client with Vite

````

---

## 🧠 Main Features

### 🎟️ User Features
- 🔍 Browse currently available movies with full details (cast, synopsis, trailers, etc.)
- ❤️ Favorite movies to a personal list
- 🪑 Choose available seats and schedule date/time for screenings
- 💳 Book tickets and pay via Stripe
- ✅ Receive email confirmations and reminders

### 🛠️ Admin Dashboard
- 📊 View analytics for movies, shows, reservations, and users
- ➕ Add new movies and sessions
- 🧾 View and manage all bookings

---

## ✉️ Email Automations (via Inngest + Brevo)
- ✅ Confirmation email after booking
- ⏰ Reminder email 8 hours before the session
- 🎬 Notification when a new movie is added

---

## 🔐 Authentication

- Powered by [Clerk.dev](https://clerk.dev), providing secure login, user management, and session handling.

---

## 🔑 Environment Variables

### Backend (`/backend/.env`)
```env
TMDB_API_KEY=
TMDB_BASE_URL=
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_KEY=
SENDER_EMAIL=
SMTP_USER=
SMTP_PASS=
````

### Frontend (`/frontend/.env`)

```env
VITE_CLERK_PUBLISHABLE_KEY=
VITE_TMDB_API_KEY=
VITE_CURRENCY=
VITE_API_ENDPOINT=
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/diegovilhalva/quickshow
cd quickshow
```

### 2. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Add `.env` files

Create the `.env` files in both `backend/` and `frontend/` with the variables listed above.

### 4. Run the project locally

Start backend:

```bash
cd backend
npm run dev
```

Start frontend:

```bash
cd frontend
npm run dev
```

---


## 📌 Notes

* The UI and all emails are written in **Portuguese**.
* Background jobs run every 8 hours to trigger email reminders.
* Stripe is used in test mode for secure payment simulation.

---

## 👨‍💻 Author

Made with ❤️ by [@diegovilhalva](https://github.com/diegovilhalva)

---

## 📝 License

This project is licensed under the MIT License.



