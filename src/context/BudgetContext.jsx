import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { defaultBudgetData } from "../data/appData";
import { apiRequest } from "../api/api";

const BudgetDataContext = createContext(null);

const STORAGE_KEY = "budgetData";

export function BudgetDataProvider({ children }) {
  // Load saved budget data safely
  const [budgetData, setBudgetData] = useState(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);

      if (savedData) {
        const parsedData = JSON.parse(savedData);

        return {
          ...defaultBudgetData,
          ...parsedData,
          income: Number(parsedData.income ?? parsedData.salary ?? defaultBudgetData.income) || 0,
          salary: Number(parsedData.salary ?? parsedData.income ?? defaultBudgetData.income) || 0,
          expenses: Number(parsedData.expenses) || 0,
          categories: parsedData.categories || {},
          transactions: Array.isArray(parsedData.transactions) ? parsedData.transactions : [],
        };
      }

      return defaultBudgetData;
    } catch (error) {
      console.error("Failed to load budget data:", error);
      return defaultBudgetData;
    }
  });

  useEffect(() => {
    if (!localStorage.getItem("authToken")) return;

    apiRequest("/transactions")
      .then(({ transactions }) => {
        const savedTransactions = transactions.map((transaction) => ({
          ...transaction,
          id: transaction._id,
          title: transaction.description || transaction.category,
          amount: Number(transaction.amount),
          date: transaction.date,
        }));

        setBudgetData((prev) => ({
          ...prev,
          transactions: savedTransactions,
          expenses: savedTransactions.reduce((total, transaction) => total + transaction.amount, 0),
        }));
      })
      .catch((error) => console.error("Failed to load transactions:", error.message));
  }, []);

  // Save budget data automatically
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(budgetData));
    } catch (error) {
      console.error("Failed to save budget data:", error);
    }
  }, [budgetData]);

  // Professional dashboard calculations
  const dashboardStats = useMemo(() => {
    const income = Number(
      budgetData.salary ?? budgetData.income
    ) || 0;
    const budget = Number(budgetData.budget) || 0;
    const expenses = Number(budgetData.expenses) || 0;

    const savings = income - expenses;
    const remaining = budget - expenses;

    const usage =
      budget > 0
        ? Math.min(Math.round((expenses / budget) * 100), 100)
        : 0;

    const actualUsage =
      budget > 0
        ? Math.round((expenses / budget) * 100)
        : 0;

    const savingsRate =
      income > 0
        ? Math.round((savings / income) * 100)
        : 0;

    let budgetStatus = "Safe";

    if (actualUsage >= 100) {
      budgetStatus = "Over Budget";
    } else if (actualUsage >= 80) {
      budgetStatus = "Warning";
    }

    const categories = Object.entries(budgetData.categories || {})
      .filter(([, value]) => Number(value) > 0)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: Number(value),
      }));

    return {
      income,
      budget,
      expenses,
      spent: expenses,
      savings,
      remaining,
      usage,
      actualUsage,
      savingsRate,
      budgetStatus,
      categories,
      transactions: Array.isArray(budgetData.transactions) ? budgetData.transactions : [],
    };
  }, [budgetData]);

  // Update budget values
  const updateBudgetData = (newData) => {
    setBudgetData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  // Add income
  const addIncome = (amount) => {
    const value = Number(amount);

    if (!value || value <= 0) return;

    setBudgetData((prev) => ({
      ...prev,
      income: Number(prev.income || 0) + value,
    }));
  };

  // Add expense
  const addExpense = (amount) => {
    const value = Number(amount);

    if (!value || value <= 0) return;

    setBudgetData((prev) => ({
      ...prev,
      expenses: Number(prev.expenses || 0) + value,
    }));
  };

  // Set monthly budget
  const setBudget = (amount) => {
    const value = Number(amount);

    if (value < 0) return;

    setBudgetData((prev) => ({
      ...prev,
      budget: value,
    }));
  };

  const addTransaction = async (transaction) => {
    const amount = Number(transaction.amount);
    if (!transaction.title?.trim() || !amount || amount <= 0) return;

    const { transaction: savedTransaction } = await apiRequest("/transactions", {
      method: "POST",
      body: JSON.stringify({
        type: transaction.type || "expense",
        category: transaction.category || "Other",
        amount,
        description: transaction.title.trim(),
        date: transaction.date,
      }),
    });

    setBudgetData((prev) => ({
      ...prev,
      expenses: Number(prev.expenses || 0) + amount,
      transactions: [
        ...(prev.transactions || []),
        {
          ...transaction,
          ...savedTransaction,
          id: savedTransaction._id,
          title: savedTransaction.description || savedTransaction.category,
          amount,
          date: transaction.date || new Date().toISOString(),
        },
      ],
    }));
  };

  const updateTransaction = async (id, changes) => {
    await apiRequest(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        type: changes.type || "expense",
        category: changes.category,
        amount: Number(changes.amount),
        description: changes.title,
        date: changes.date,
      }),
    });

    setBudgetData((prev) => {
      const transactions = (prev.transactions || []).map((transaction) =>
        transaction.id === id
          ? { ...transaction, ...changes, amount: Number(changes.amount ?? transaction.amount) }
          : transaction
      );

      return {
        ...prev,
        transactions,
        expenses: transactions.reduce((total, transaction) => total + Number(transaction.amount || 0), 0),
      };
    });
  };

  const deleteTransaction = async (id) => {
    await apiRequest(`/transactions/${id}`, { method: "DELETE" });

    setBudgetData((prev) => {
      const transactions = (prev.transactions || []).filter((transaction) => transaction.id !== id);
      return {
        ...prev,
        transactions,
        expenses: transactions.reduce((total, transaction) => total + Number(transaction.amount || 0), 0),
      };
    });
  };

  // Reset all budget data
  const resetBudgetData = () => {
    setBudgetData(defaultBudgetData);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    // Raw data
    budgetData,

    // Dashboard statistics
    ...dashboardStats,

    // Actions
    updateBudgetData,
    addIncome,
    addExpense,
    setBudget,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    resetBudgetData,
  };

  return (
    <BudgetDataContext.Provider value={value}>
      {children}
    </BudgetDataContext.Provider>
  );
}

export function useBudgetData() {
  const context = useContext(BudgetDataContext);

  if (!context) {
    throw new Error(
      "useBudgetData must be used within a BudgetDataProvider"
    );
  }

  return context;
}