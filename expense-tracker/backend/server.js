const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Expense = require("./models/Expense");

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "*"
}));
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
    res.send("Expense Tracker API Running");
});

// Get all expenses
app.get("/api/expenses", async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add expense
app.post("/api/expenses", async (req, res) => {
    try {
        const { title, amount, category } = req.body;

        if (!title || !category || !Number.isFinite(Number(amount)) ||
            Number(amount) <= 0) {
            return res.status(400).json({
                message: "Enter a title, category and valid amount"
            });
        }

        const expense = new Expense({
            title,
            amount: Number(amount),
            category
        });

        const savedExpense = await expense.save();
        res.status(201).json(savedExpense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete expense
app.delete("/api/expenses/:id", async (req, res) => {
    try {
        const deleted = await Expense.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Invalid expense ID" });
    }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});