import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import expenseRoute from "./routes/expense.route.js";

dotenv.config();

const app = express();
const PORT = 8000;

// CORS first (important!)
const corsOptions = {
    origin: ["http://localhost:5173", "https://expense-tracker-pi-henna.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/expense", expenseRoute);

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running at port ${PORT}`);
});
