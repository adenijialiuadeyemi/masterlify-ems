import express from "express"
import cors from "cors"
import multer from "multer"
import connectDB from "./config/db.js"

// Initialize app
const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json())
app.use(multer().none())

// Routes
app.get("/", (req, res) => {
  res.send("Server is running")
})

// Example POST route
app.post("/submit", (req, res) => {
  res.json({ message: "Data received", data: req.body })
})


await connectDB();
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})