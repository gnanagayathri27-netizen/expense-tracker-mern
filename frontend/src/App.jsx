import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000/api/expenses";

function App() {
  const [expenses, setExpenses] = useState([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  // Get expenses from backend
  const fetchExpenses = async () => {
    try {
      const response = await axios.get(API);
      setExpenses(response.data);
    } catch (error) {
      alert("Cannot connect to backend!");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add new expense
  const addExpense = async (e) => {
    e.preventDefault();

    if (!title.trim() || !amount || Number(amount) <= 0) {
      alert("Please enter valid details");
      return;
    }

    try {
      await axios.post(API, {
        title,
        amount: Number(amount),
        category
      });

      setTitle("");
      setAmount("");
      setCategory("Food");

      fetchExpenses();
    } catch (error) {
      alert("Failed to add expense");
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchExpenses();
    } catch (error) {
      alert("Failed to delete expense");
    }
  };

  // Calculate total
  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  return (
    <div className="container">

      <header>
        <h1>Expense Tracker</h1>
        <p>Manage your daily expenses easily</p>
      </header>

      {/* Total expenses */}
      <div className="total-card">
        <h3>Total Expenses</h3>
        <h1>₹{total.toFixed(2)}</h1>
        <p>{expenses.length} transactions</p>
      </div>

      {/* Add expense form */}
      <div className="form-card">
        <h2>Add New Expense</h2>

        <form onSubmit={addExpense}>

          <input
            type="text"
            placeholder="Expense name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Amount"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Education</option>
            <option>Entertainment</option>
            <option>Other</option>
          </select>

          <button type="submit">
            Add Expense
          </button>

        </form>
      </div>

      {/* Expense list */}
      <div className="list-card">
        <h2>Recent Expenses</h2>

        {expenses.length === 0 ? (
          <p className="empty">No expenses added yet.</p>
        ) : (
          expenses.map((expense) => (
            <div className="expense-item" key={expense._id}>

              <div>
                <h3>{expense.title}</h3>
                <p>{expense.category}</p>
                <small>
                  {new Date(expense.date).toLocaleDateString()}
                </small>
              </div>

              <div className="expense-right">
                <h3>₹{Number(expense.amount).toFixed(2)}</h3>

                <button
                  className="delete-btn"
                  onClick={() => deleteExpense(expense._id)}
                >
                  Delete
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default App;