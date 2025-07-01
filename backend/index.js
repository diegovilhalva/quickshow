import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from '@clerk/express'
import showRoutes from "./routes/showRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import "dotenv/config";
import connectDB from "./config/db.js";
import { inngest, functions } from "./inngest/index.js";
import { stripeWebhooks } from "./controllers/stripe-webhooks.js";

const app = express();
const PORT = process.env.PORT || 4000;
app.use('/api/stripe',express.raw({type:"application/json"}),stripeWebhooks)

app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(clerkMiddleware())

app.get("/", (req, res) => {
  res.send("Servidor OK");
});
app.use("/api/inngest", serve({ client: inngest, functions }))
app.use("/api/show", showRoutes)
app.use("/api/booking", bookingRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/user", userRoutes)

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
  }
};

startServer();
