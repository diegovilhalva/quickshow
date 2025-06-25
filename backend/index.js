import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from '@clerk/express'
import "dotenv/config";
import connectDB from "./config/db.js";
import { inngest, functions } from "./inngest/index.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())

app.get("/", (req, res) => {
  res.send("Servidor OK");
});
app.use("/api/inngest", serve({ client: inngest, functions }));
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
