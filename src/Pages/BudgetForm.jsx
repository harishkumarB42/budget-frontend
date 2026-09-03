import { useEffect, useState } from "react";
import {
  Wallet,
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Save,
  RotateCcw,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  PiggyBank,
  Target,
  Landmark,
} from "lucide-react";

import { useBudgetData } from "../context/BudgetContext";

function Budget() {
  /* ==========================================================
     USER FINANCIAL DATA
  ========================================================== */

  const [salary, setSalary] = useState("");
  const [savings, setSavings] = useState("");

  const [budget, setBudget] = useState({
    food: "",
    transport: "",
    shopping: "",
    bills: "",
  });

  const [saved, setSaved] = useState(false);

  const {
    budgetData,
    spent,
    remaining,
    usage,
    updateBudgetData,
  } = useBudgetData();

  /* ==========================================================
     LOAD EXISTING DATA
  ========================================================== */

  useEffect(() => {
    if (budgetData) {
      setSalary(budgetData.salary || "");
      setSavings(budgetData.savings || "");

      if (budgetData.categories) {
        setBudget({
          food: budgetData.categories.food || "",
          transport: budgetData.categories.transport || "",
          shopping: budgetData.categories.shopping || "",
          bills: budgetData.categories.bills || "",
        });
      }
    }
  }, [budgetData]);

  /* ==========================================================
     HANDLE CATEGORY INPUT
  ========================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (Number(value) < 0) return;

    setBudget({
      ...budget,
      [name]: value,
    });

    setSaved(false);
  };

  /* ==========================================================
     FINANCIAL CALCULATIONS
  ========================================================== */

  const monthlySalary = Number(salary || 0);

  const fixedSavings = Number(savings || 0);

  const totalBudget =
    Number(budget.food || 0) +
    Number(budget.transport || 0) +
    Number(budget.shopping || 0) +
    Number(budget.bills || 0);

  // Money available after fixed savings
  const availableForExpenses =
    monthlySalary - fixedSavings;

  // Remaining money after planned expenses
  const moneyRemaining =
    availableForExpenses - totalBudget;

  // Savings percentage
  const savingsPercentage =
    monthlySalary > 0
      ? Math.round(
          (fixedSavings / monthlySalary) * 100
        )
      : 0;

  // Expense allocation percentage
  const expensePercentage =
    availableForExpenses > 0
      ? Math.round(
          (totalBudget / availableForExpenses) * 100
        )
      : 0;

  /* ==========================================================
     HANDLE SUBMIT
  ========================================================== */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (monthlySalary <= 0) {
      alert("Please enter your monthly salary.");
      return;
    }

    if (fixedSavings < 0) {
      alert("Savings cannot be negative.");
      return;
    }

    if (fixedSavings > monthlySalary) {
      alert(
        "Savings cannot be greater than your monthly salary."
      );
      return;
    }

    if (totalBudget <= 0) {
      alert(
        "Please enter at least one expense budget."
      );
      return;
    }

    if (totalBudget > availableForExpenses) {
      alert(
        "Your total expenses cannot be greater than your salary after savings."
      );
      return;
    }

    updateBudgetData({
      income: monthlySalary,
      salary: monthlySalary,

      savings: fixedSavings,

      availableForExpenses,

      budget: totalBudget,
      expenses: totalBudget,

      moneyRemaining,

      categories: {
        food: Number(budget.food || 0),
        transport: Number(budget.transport || 0),
        shopping: Number(budget.shopping || 0),
        bills: Number(budget.bills || 0),
      },
    });

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  /* ==========================================================
     RESET FORM
  ========================================================== */

  const handleReset = () => {
    setSalary("");
    setSavings("");

    setBudget({
      food: "",
      transport: "",
      shopping: "",
      bills: "",
    });

    setSaved(false);
  };

  /* ==========================================================
     CATEGORY DATA
  ========================================================== */

  const categories = [
    {
      name: "food",
      title: "Food & Dining",
      description: "Groceries, restaurants and meals",
      icon: Utensils,
      color: "orange",
    },

    {
      name: "transport",
      title: "Transportation",
      description: "Fuel, travel and public transport",
      icon: Car,
      color: "blue",
    },

    {
      name: "shopping",
      title: "Shopping",
      description: "Clothing, electronics and personal items",
      icon: ShoppingBag,
      color: "purple",
    },

    {
      name: "bills",
      title: "Bills & Utilities",
      description: "Electricity, internet and subscriptions",
      icon: Receipt,
      color: "emerald",
    },
  ];

  /* ==========================================================
     COLOR HELPERS
  ========================================================== */

  const getColorClasses = (color) => {
    const colors = {
      orange: {
        icon: "bg-orange-50 text-orange-600",
        focus:
          "focus:border-orange-400 focus:ring-orange-100",
        badge: "bg-orange-50 text-orange-600",
      },

      blue: {
        icon: "bg-blue-50 text-blue-600",
        focus:
          "focus:border-blue-400 focus:ring-blue-100",
        badge: "bg-blue-50 text-blue-600",
      },

      purple: {
        icon: "bg-purple-50 text-purple-600",
        focus:
          "focus:border-purple-400 focus:ring-purple-100",
        badge: "bg-purple-50 text-purple-600",
      },

      emerald: {
        icon: "bg-emerald-50 text-emerald-600",
        focus:
          "focus:border-emerald-400 focus:ring-emerald-100",
        badge: "bg-emerald-50 text-emerald-600",
      },
    };

    return colors[color];
  };

  /* ==========================================================
     CATEGORY PERCENTAGE
  ========================================================== */

  const getCategoryPercentage = (value) => {
    if (totalBudget <= 0) return 0;

    return Math.round(
      (Number(value || 0) / totalBudget) * 100
    );
  };

  /* ==========================================================
     BUDGET USAGE STATUS
  ========================================================== */

  const usageValue = Number(usage || 0);

  const getUsageStatus = () => {
    if (usageValue >= 90) {
      return {
        title: "Budget limit reached",
        description:
          "Your spending is very close to your monthly budget.",
        icon: AlertCircle,
        className:
          "bg-red-50 border-red-100 text-red-700",
      };
    }

    if (usageValue >= 70) {
      return {
        title: "Monitor your spending",
        description:
          "You're approaching your monthly budget limit.",
        icon: AlertCircle,
        className:
          "bg-yellow-50 border-yellow-100 text-yellow-700",
      };
    }

    return {
      title: "You're on track",
      description:
        "Your current spending is within a healthy range.",
      icon: CheckCircle2,
      className:
        "bg-emerald-50 border-emerald-100 text-emerald-700",
    };
  };

  const usageStatus = getUsageStatus();

  const UsageIcon = usageStatus.icon;

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950">

        <div className="absolute -top-32 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 relative z-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <div className="flex items-center gap-3 mb-3">

                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">

                  <Wallet
                    size={22}
                    className="text-blue-300"
                  />

                </div>

                <span className="text-xs font-bold tracking-widest text-blue-300">
                  FINANCIAL PLANNING
                </span>

              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Budget Planning
              </h1>

              <p className="text-slate-400 mt-2 max-w-xl">
                Plan your salary, savings and monthly expenses
                in one place.
              </p>

            </div>

            <div className="flex items-center gap-3">

              <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">

                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Monthly Salary
                </p>

                <p className="text-xl font-bold text-white mt-1">
                  ₹{monthlySalary.toLocaleString()}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          CONTENT
      ======================================================= */}

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-8">

        {/* ====================================================
            SUMMARY CARDS
        ===================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">

          {/* SALARY */}

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg transition">

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">

                <Wallet
                  size={21}
                  className="text-emerald-600"
                />

              </div>

              <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                INCOME
              </span>

            </div>

            <p className="text-sm text-slate-500 mt-5">
              Monthly Salary
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              ₹{monthlySalary.toLocaleString()}
            </h2>

          </div>

          {/* SAVINGS */}

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg transition">

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                <PiggyBank
                  size={21}
                  className="text-blue-600"
                />

              </div>

              <span className="text-[10px] font-bold tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                SAVINGS
              </span>

            </div>

            <p className="text-sm text-slate-500 mt-5">
              Fixed Savings
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              ₹{fixedSavings.toLocaleString()}
            </h2>

            <p className="text-xs text-blue-600 mt-2">
              {savingsPercentage}% of salary
            </p>

          </div>

          {/* AVAILABLE */}

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg transition">

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">

                <Landmark
                  size={21}
                  className="text-indigo-600"
                />

              </div>

              <span className="text-[10px] font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                AVAILABLE
              </span>

            </div>

            <p className="text-sm text-slate-500 mt-5">
              Available for Expenses
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              ₹{Math.max(
                availableForExpenses,
                0
              ).toLocaleString()}
            </h2>

          </div>

          {/* TOTAL BUDGET */}

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg transition">

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">

                <Target
                  size={21}
                  className="text-purple-600"
                />

              </div>

              <span className="text-[10px] font-bold tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                EXPENSES
              </span>

            </div>

            <p className="text-sm text-slate-500 mt-5">
              Planned Expenses
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              ₹{totalBudget.toLocaleString()}
            </h2>

            <p className="text-xs text-purple-600 mt-2">
              {expensePercentage}% allocated
            </p>

          </div>

          {/* REMAINING */}

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg transition">

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">

                <PiggyBank
                  size={21}
                  className="text-amber-600"
                />

              </div>

              <span className="text-[10px] font-bold tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                LEFT
              </span>

            </div>

            <p className="text-sm text-slate-500 mt-5">
              Money Remaining
            </p>

            <h2
              className={`text-2xl font-bold mt-1 ${
                moneyRemaining < 0
                  ? "text-red-600"
                  : "text-emerald-600"
              }`}
            >
              ₹{moneyRemaining.toLocaleString()}
            </h2>

          </div>

        </div>

        {/* ====================================================
            MAIN GRID
        ===================================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ==================================================
              FORM
          =================================================== */}

          <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

            {/* HEADER */}

            <div className="p-6 md:p-8 border-b border-slate-100">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Monthly Financial Plan
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Set your salary, fixed savings and monthly
                    spending limits.
                  </p>

                </div>

                <div className="hidden sm:flex w-11 h-11 rounded-xl bg-blue-50 items-center justify-center">

                  <Wallet
                    size={21}
                    className="text-blue-600"
                  />

                </div>

              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 md:p-8"
            >

              {/* ================================================
                  SALARY & SAVINGS
              ================================================= */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">

                {/* SALARY */}

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

                  <div className="flex items-center gap-3 mb-4">

                    <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">

                      <Wallet
                        size={21}
                        className="text-emerald-600"
                      />

                    </div>

                    <div>

                      <h3 className="font-bold text-slate-800">
                        Monthly Salary
                      </h3>

                      <p className="text-xs text-slate-500">
                        Enter your monthly income
                      </p>

                    </div>

                  </div>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={salary}
                      onChange={(e) => {
                        if (
                          Number(e.target.value) < 0
                        ) {
                          return;
                        }

                        setSalary(e.target.value);
                        setSaved(false);
                      }}
                      placeholder="Enter salary"
                      className="w-full h-12 pl-9 pr-4 rounded-xl border border-emerald-200 bg-white text-slate-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition"
                    />

                  </div>

                </div>

                {/* SAVINGS */}

                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">

                  <div className="flex items-center gap-3 mb-4">

                    <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">

                      <PiggyBank
                        size={21}
                        className="text-blue-600"
                      />

                    </div>

                    <div>

                      <h3 className="font-bold text-slate-800">
                        Fixed Monthly Savings
                      </h3>

                      <p className="text-xs text-slate-500">
                        Choose your savings amount
                      </p>

                    </div>

                  </div>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      max={
                        monthlySalary > 0
                          ? monthlySalary
                          : undefined
                      }
                      value={savings}
                      onChange={(e) => {
                        const value =
                          Number(e.target.value);

                        if (value < 0) {
                          return;
                        }

                        if (
                          monthlySalary > 0 &&
                          value > monthlySalary
                        ) {
                          return;
                        }

                        setSavings(e.target.value);
                        setSaved(false);
                      }}
                      placeholder="Enter savings"
                      className="w-full h-12 pl-9 pr-4 rounded-xl border border-blue-200 bg-white text-slate-800 font-semibold outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
                    />

                  </div>

                  <p className="text-xs text-blue-600 mt-3 font-medium">
                    {savingsPercentage}% of your salary
                  </p>

                </div>

              </div>

              {/* AVAILABLE MONEY */}

              <div className="mb-7 rounded-2xl bg-slate-950 p-5 text-white">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div>

                    <p className="text-sm text-slate-400">
                      Available for Monthly Expenses
                    </p>

                    <p className="text-3xl font-bold mt-1">
                      ₹
                      {Math.max(
                        availableForExpenses,
                        0
                      ).toLocaleString()}
                    </p>

                  </div>

                  <div className="text-left sm:text-right">

                    <p className="text-xs text-slate-400">
                      Salary − Savings
                    </p>

                    <p className="text-sm font-semibold text-emerald-400 mt-1">
                      ₹{monthlySalary.toLocaleString()}
                      {" − "}
                      ₹{fixedSavings.toLocaleString()}
                    </p>

                  </div>

                </div>

              </div>

              {/* ================================================
                  CATEGORY BUDGETS
              ================================================= */}

              <div className="mb-4">

                <h3 className="font-bold text-slate-900">
                  Set Category Budgets
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Allocate your available money across categories.
                </p>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {categories.map((category) => {
                  const Icon = category.icon;

                  const colors =
                    getColorClasses(category.color);

                  const value =
                    budget[category.name];

                  return (
                    <div
                      key={category.name}
                      className="group rounded-2xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-md transition-all duration-300"
                    >

                      <div className="flex items-start gap-4">

                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.icon}`}
                        >
                          <Icon size={21} />
                        </div>

                        <div className="flex-1">

                          <div className="flex items-start justify-between gap-2">

                            <div>

                              <h3 className="font-bold text-slate-800">
                                {category.title}
                              </h3>

                              <p className="text-xs text-slate-400 mt-1">
                                {category.description}
                              </p>

                            </div>

                            <span
                              className={`text-[10px] font-bold px-2 py-1 rounded-full ${colors.badge}`}
                            >
                              {getCategoryPercentage(value)}%
                            </span>

                          </div>

                        </div>

                      </div>

                      <div className="relative mt-5">

                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                          ₹
                        </span>

                        <input
                          type="number"
                          min="0"
                          name={category.name}
                          value={value}
                          onChange={handleChange}
                          placeholder="0"
                          className={`w-full h-12 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold outline-none focus:bg-white focus:ring-4 transition ${colors.focus}`}
                        />

                      </div>

                    </div>
                  );
                })}

              </div>

              {/* TOTAL EXPENSES */}

              <div className="mt-7 p-5 rounded-2xl bg-slate-950 text-white">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div>

                    <p className="text-sm text-slate-400">
                      Planned Monthly Expenses
                    </p>

                    <p className="text-3xl font-bold mt-1">
                      ₹{totalBudget.toLocaleString()}
                    </p>

                  </div>

                  <div className="text-left sm:text-right">

                    <p className="text-xs text-slate-400">
                      Money Remaining
                    </p>

                    <p
                      className={`text-xl font-bold mt-1 ${
                        moneyRemaining < 0
                          ? "text-red-400"
                          : "text-emerald-400"
                      }`}
                    >
                      ₹{moneyRemaining.toLocaleString()}
                    </p>

                  </div>

                </div>

              </div>

              {/* WARNING */}

              {totalBudget > availableForExpenses &&
                monthlySalary > 0 && (
                  <div className="mt-5 flex gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700">

                    <AlertCircle
                      size={19}
                      className="mt-0.5"
                    />

                    <div>

                      <p className="font-bold text-sm">
                        Budget exceeds available money
                      </p>

                      <p className="text-xs mt-1">
                        Reduce your category expenses or
                        change your salary or savings.
                      </p>

                    </div>

                  </div>
                )}

              {/* BUTTONS */}

              <div className="flex flex-col sm:flex-row gap-3 mt-6">

                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/20 transition-all"
                >
                  <Save size={18} />
                  Save Financial Plan
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="sm:w-32 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
                >
                  <RotateCcw size={17} />
                  Reset
                </button>

              </div>

              {/* SUCCESS MESSAGE */}

              {saved && (
                <div className="mt-4 flex items-center gap-2 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700">

                  <CheckCircle2 size={18} />

                  <p className="text-sm font-semibold">
                    Your financial plan has been saved successfully.
                  </p>

                </div>
              )}

            </form>

          </div>

          {/* ==================================================
              RIGHT SIDE SUMMARY
          =================================================== */}

          <div className="space-y-6">

            {/* FINANCIAL OVERVIEW */}

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <p className="text-sm text-slate-500">
                    Financial Overview
                  </p>

                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    Monthly Breakdown
                  </h2>

                </div>

                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">

                  <TrendingUp
                    size={20}
                    className="text-indigo-600"
                  />

                </div>

              </div>

              <div className="space-y-5">

                <SummaryRow
                  label="Monthly Salary"
                  value={monthlySalary}
                  icon={Wallet}
                  color="emerald"
                />

                <SummaryRow
                  label="Fixed Savings"
                  value={fixedSavings}
                  icon={PiggyBank}
                  color="blue"
                />

                <SummaryRow
                  label="Available Expenses"
                  value={availableForExpenses}
                  icon={Landmark}
                  color="indigo"
                />

                <SummaryRow
                  label="Planned Expenses"
                  value={totalBudget}
                  icon={Target}
                  color="purple"
                />

                <div className="pt-4 border-t border-slate-100">

                  <div className="flex items-center justify-between">

                    <span className="text-sm font-bold text-slate-700">
                      Final Remaining
                    </span>

                    <span
                      className={`font-bold ${
                        moneyRemaining < 0
                          ? "text-red-600"
                          : "text-emerald-600"
                      }`}
                    >
                      ₹{moneyRemaining.toLocaleString()}
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* CATEGORY BREAKDOWN */}

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <BarChartIcon />
                </div>

                <div>

                  <h2 className="font-bold text-slate-900">
                    Category Breakdown
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    Your planned allocation
                  </p>

                </div>

              </div>

              <div className="space-y-5">

                {categories.map((category) => {
                  const Icon = category.icon;

                  const value =
                    Number(
                      budget[category.name] || 0
                    );

                  const percentage =
                    getCategoryPercentage(value);

                  const colors =
                    getColorClasses(category.color);

                  return (
                    <div key={category.name}>

                      <div className="flex items-center justify-between mb-2">

                        <div className="flex items-center gap-2">

                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${colors.icon}`}
                          >
                            <Icon size={14} />
                          </div>

                          <span className="text-sm font-medium text-slate-700">
                            {category.title}
                          </span>

                        </div>

                        <span className="text-xs font-bold text-slate-500">
                          ₹{value.toLocaleString()}
                        </span>

                      </div>

                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            category.color === "orange"
                              ? "bg-orange-500"
                              : category.color === "blue"
                              ? "bg-blue-500"
                              : category.color === "purple"
                              ? "bg-purple-500"
                              : "bg-emerald-500"
                          }`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

            {/* BUDGET HEALTH */}

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

              <div className="flex items-center justify-between mb-5">

                <div>

                  <p className="text-sm text-slate-500">
                    Actual Spending
                  </p>

                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    Budget Health
                  </h2>

                </div>

                <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">

                  <TrendingUp
                    size={20}
                    className="text-amber-600"
                  />

                </div>

              </div>

              <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden">

                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    usageValue >= 90
                      ? "bg-red-500"
                      : usageValue >= 70
                      ? "bg-yellow-500"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600"
                  }`}
                  style={{
                    width: `${Math.min(
                      usageValue,
                      100
                    )}%`,
                  }}
                />

              </div>

              <div className="flex justify-between mt-3 text-xs">

                <span className="text-slate-400">
                  ₹{Number(
                    spent || 0
                  ).toLocaleString()} spent
                </span>

                <span className="font-bold text-slate-700">
                  {usageValue}%
                </span>

              </div>

              <div
                className={`mt-6 p-4 rounded-2xl border ${usageStatus.className}`}
              >

                <div className="flex gap-3">

                  <UsageIcon
                    size={19}
                    className="mt-0.5"
                  />

                  <div>

                    <p className="text-sm font-bold">
                      {usageStatus.title}
                    </p>

                    <p className="text-xs mt-1 leading-5 opacity-80">
                      {usageStatus.description}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* SMART TIP */}

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white relative overflow-hidden">

              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full" />

              <div className="relative z-10">

                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">

                  <PiggyBank size={19} />

                </div>

                <h3 className="font-bold">
                  Your Financial Plan
                </h3>

                <p className="text-sm text-indigo-100 mt-2 leading-6">

                  Salary:
                  {" "}
                  ₹{monthlySalary.toLocaleString()}

                  <br />

                  Savings:
                  {" "}
                  ₹{fixedSavings.toLocaleString()}

                  <br />

                  Expenses:
                  {" "}
                  ₹{totalBudget.toLocaleString()}

                  <br />

                  Remaining:
                  {" "}
                  ₹{moneyRemaining.toLocaleString()}

                </p>

              </div>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="py-8 text-center text-xs text-slate-400">
          Build a better financial future, one budget at a time.
        </div>

      </main>

    </div>
  );
}


/* ============================================================
   SUMMARY ROW COMPONENT
============================================================ */

function SummaryRow({
  label,
  value,
  icon: Icon,
  color,
}) {
  const colorClasses = {
    emerald:
      "bg-emerald-50 text-emerald-600",

    blue:
      "bg-blue-50 text-blue-600",

    indigo:
      "bg-indigo-50 text-indigo-600",

    purple:
      "bg-purple-50 text-purple-600",
  };

  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            colorClasses[color]
          }`}
        >
          <Icon size={17} />
        </div>

        <span className="text-sm text-slate-600">
          {label}
        </span>

      </div>

      <span className="font-bold text-slate-800">
        ₹{Math.max(
          Number(value || 0),
          0
        ).toLocaleString()}
      </span>

    </div>
  );
}


/* ============================================================
   SMALL BAR CHART ICON
============================================================ */

function BarChartIcon() {
  return (
    <div className="flex items-end gap-1 h-5">

      <span className="w-1.5 h-3 bg-purple-500 rounded-sm" />

      <span className="w-1.5 h-5 bg-purple-500 rounded-sm" />

      <span className="w-1.5 h-4 bg-purple-500 rounded-sm" />

    </div>
  );
}


export default Budget;