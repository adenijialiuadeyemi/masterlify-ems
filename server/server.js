import express from "express"
import cors from "cors"
import multer from "multer"
import connectDB from "./config/db.js"
import authRouter from "./routes/authRoutes.js"
import employeesRouter from "./routes/employeeRoutes.js"
import profileRouter from "./routes/profileRoutes.js"
import attendanceRouter from "./routes/attendanceRoutes.js"
import leaveRouter from "./routes/leaveRoutes.js"
import payslipRouter from "./routes/payslipRoutes.js"
import dashboardRouter from "./routes/dashboardRoutes.js"
import { inngest, functions } from "./inngest/index.js"
import { serve } from "inngest/express"
import job from "./config/cron.js"

// Initialize app
const app = express()
const PORT = process.env.PORT || 4000

job.start(); // Start the cron job to keep the server awake on platforms like Render.com

// Middleware
app.use(cors())
app.use(express.json())
app.use(multer().none())

// Routes
app.get("/", (req, res) => {
  res.send("Server is running")
})

// Routes
app.use("/api/auth", authRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/profile", profileRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/leaves", leaveRouter);
app.use("/api/payslips", payslipRouter);
app.use("/api/dashboard", dashboardRouter);

app.use("/api/inngest", serve({client:inngest, functions}))

await connectDB();
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})