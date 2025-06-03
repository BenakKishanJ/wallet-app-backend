import { Router } from "express";
import {
  getTransactionsByUserId,
  postTransaction,
  deleteTransactionById,
  getSummaryByUserId,
} from "../controllers/transactionsController.js";

const router = Router();

export default router;

router.get("/:userId", getTransactionsByUserId);

router.post("", postTransaction);

router.delete("/:id", deleteTransactionById);

router.get("/summary/:userId", getSummaryByUserId);
