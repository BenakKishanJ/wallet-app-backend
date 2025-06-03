import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "Please provide userId" });
    }
    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
    res.status(200).json(transactions);
  } catch (err) {
    console.log("Error while fetching transactions : ", err);
    res.status(500).json({ message: "Error while fetching transactions" });
  }
}

export async function postTransaction(req, res) {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || !amount || !category) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }

    const transactions =
      await sql`INSERT INTO transactions(user_id, title, amount, category) VALUES(${user_id}, ${title}, ${amount}, ${category}) RETURNING *`;
    console.log("Transaction added successfully : ", transactions[0]);
    res.status(201).json({ message: "Transaction added successfully" });
  } catch (err) {
    console.log("Error while adding transaction : ", err);
    res.status(500).json({ message: "Error while adding transaction" });
  }
}

export async function deleteTransactionById(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Please provide id" });
    }
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Please provide valid id" });
    }

    const transactions =
      await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
    if (transactions.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    } else {
      console.log("Transaction deleted successfully : ", transactions[0]);
      res.status(200).json({ message: "Transaction deleted successfully" });
    }
  } catch (err) {
    console.log("Error while deleting transaction : ", err);
    res.status(500).json({ message: "Error while deleting transaction" });
  }
}

export async function getSummaryByUserId(req, res) {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "Please provide userId" });
    }
    const balanceResult =
      await sql`SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}`;
    const incomeResult =
      await sql`SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0`;
    const expenseResult =
      await sql`SELECT COALESCE(SUM(amount), 0) as expense FROM transactions WHERE user_id = ${userId} AND amount < 0`;

    const summary = {
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    };
    res.status(200).json(summary);
  } catch (err) {
    console.log("Error while fetching transactions summary : ", err);
    res
      .status(500)
      .json({ message: "Error while fetching transactions summary" });
  }
}
