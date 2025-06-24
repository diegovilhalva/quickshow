import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/db.js"

const app = express()
const PORT = process.env.PORT || 4000


app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("Servidor OK")
})

app.listen(PORT, () => {
    connectDB()
    console.log(`Servidor rodando na porta ${PORT}`)
})


