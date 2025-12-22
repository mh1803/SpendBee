import { useMemo, useState } from "react";
import type { Transaction } from "../../../types/analysis";
import styles from "./Transactions.module.css";

interface TransactionsProps {
  transactions: Transaction[];
  currency: string;
}

type SortOption =
  | "none"
  | "amount-asc"
  | "amount-desc"
  | "date-asc"
  | "date-desc";

type FlowFilter = "all" | "spending" | "income";

function capitaliseFirst(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function Transactions({ transactions, currency }: TransactionsProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [flow, setFlow] = useState<FlowFilter>("all");

  // Default: newest first
  const [sort, setSort] = useState<SortOption>("date-desc");

  const startOfMonth = useMemo(() => {
    if (transactions.length === 0) return null;

    const latest = transactions.reduce((latest, tx) => {
      const d = new Date(tx.date);
      return d > latest ? d : latest;
    }, new Date(transactions[0].date));

    return new Date(latest.getFullYear(), latest.getMonth(), 1);
  }, [transactions]);

  const categories = useMemo(() => {
    return Array.from(new Set(transactions.map((t) => t.category)));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let result = transactions;

    // Filter to statement month
    if (startOfMonth) {
      result = result.filter((tx) => {
        const txDate = new Date(tx.date);
        return !isNaN(txDate.getTime()) && txDate >= startOfMonth;
      });
    }

    // Income / Spending filter
    if (flow === "spending") {
      result = result.filter((tx) => tx.amount < 0);
    }

    if (flow === "income") {
      result = result.filter((tx) => tx.amount > 0);
    }

    // Search
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.description.toLowerCase().includes(lowerSearch) ||
          tx.category.toLowerCase().includes(lowerSearch) ||
          tx.date.toLowerCase().includes(lowerSearch) ||
          tx.amount.toString().includes(lowerSearch)
      );
    }

    // Category
    if (category !== "all") {
      result = result.filter((tx) => tx.category === category);
    }

    // Sorting
    switch (sort) {
      case "amount-asc":
        result = [...result].sort((a, b) => a.amount - b.amount);
        break;
      case "amount-desc":
        result = [...result].sort((a, b) => b.amount - a.amount);
        break;
      case "date-asc":
        result = [...result].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "date-desc":
        result = [...result].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
    }

    return result;
  }, [transactions, search, category, sort, flow, startOfMonth]);

  return (
    <div className={styles.transactions}>
      <h3>Transactions</h3>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search transactions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={flow}
          onChange={(e) => setFlow(e.target.value as FlowFilter)}
        >
          <option value="all">All</option>
          <option value="spending">Spending</option>
          <option value="income">Income</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {capitaliseFirst(cat)}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="amount-desc">Amount ↓</option>
          <option value="amount-asc">Amount ↑</option>
        </select>
      </div>

      <ul className={styles.transactionList}>
        {filteredTransactions.map((tx) => (
          <li
            key={`${tx.date}-${tx.description}`}
            className={styles.transactionItem}
          >
            <span className={styles.txDate}>{tx.date}</span>
            <span className={styles.txDescription}>{tx.description}</span>
            <span className={styles.txCategory}>
              {capitaliseFirst(tx.category)}
            </span>
            <span
              className={
                tx.amount < 0
                  ? styles.txAmountNegative
                  : styles.txAmountPositive
              }
            >
              {tx.amount < 0 ? "-" : "+"}
              {currency}
              {Math.abs(tx.amount).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
