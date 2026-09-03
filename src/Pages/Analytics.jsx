
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  ShoppingBag,
  Utensils,
  Car,
  Receipt,
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";

import { COLORS } from "../data/appData";
import { useBudgetData } from "../context/BudgetContext";

function Analytics() {
  const {
    budgetData,
    income,
    spent,
    savings,
    remaining,
    usage,
    categories,
  } = useBudgetData();

  /* =====================================================
     FINANCIAL VALUES
  ===================================================== */

  const totalIncome = Number(income || 0);

  const totalBudget = Number(budgetData?.budget || 0);

  const totalSpent = Number(spent || 0);

  const totalSavings = Number(savings || 0);

  const totalRemaining = Number(remaining || 0);

  const usageValue = Number(usage || 0);

  /* =====================================================
     STATIC MONTH-TO-MONTH REVENUE DATA

     Previous months are fixed.
     Current month automatically uses user income.
  ===================================================== */

  const currentMonth = new Date().toLocaleString("en-US", {
    month: "short",
  });

  const staticRevenueData = [
    { month: "Jan", revenue: 35000 },
    { month: "Feb", revenue: 42000 },
    { month: "Mar", revenue: 38000 },
    { month: "Apr", revenue: 50000 },
    { month: "May", revenue: 46000 },
    { month: "Jun", revenue: 55000 },
    { month: "Jul", revenue: 48000 },
    { month: "Aug", revenue: 60000 },
    { month: "Sep", revenue: 58000 },
    { month: "Oct", revenue: 62000 },
    { month: "Nov", revenue: 65000 },
    { month: "Dec", revenue: 70000 },
  ];

  /*
    Replace the current month's static value
    with the user's actual income.
  */

  const revenueData = staticRevenueData.map((item) => ({
    ...item,
    revenue:
      item.month === currentMonth
        ? totalIncome || item.revenue
        : item.revenue,
  }));

  /* =====================================================
     EXPENSE CATEGORY DATA
  ===================================================== */

  const categoryData =
    Array.isArray(categories) && categories.length > 0
      ? categories
      : [
          {
            name: "No expenses yet",
            value: 1,
          },
        ];

  /* =====================================================
     SAVINGS RATE
  ===================================================== */

  const savingsRate =
    totalIncome > 0
      ? Math.round(
          (totalSavings / totalIncome) * 100
        )
      : 0;

  /* =====================================================
     SAFE BUDGET USAGE
  ===================================================== */

  const safeUsage = Math.min(
    Math.max(usageValue, 0),
    100
  );

  /* =====================================================
     BUDGET COLOR
  ===================================================== */

  const getUsageColor = () => {
    if (usageValue >= 90) {
      return "bg-red-500";
    }

    if (usageValue >= 70) {
      return "bg-yellow-500";
    }

    return "bg-indigo-600";
  };

  /* =====================================================
     BUDGET MESSAGE
  ===================================================== */

  const getUsageMessage = () => {
    if (usageValue >= 90) {
      return "You're very close to your budget limit.";
    }

    if (usageValue >= 70) {
      return "Keep an eye on your spending this month.";
    }

    return "Your spending is currently under control.";
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =================================================
          HERO HEADER
      ================================================= */}

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950">

        {/* Background Decorations */}

        <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-10">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            {/* Title */}

            <div>

              <div className="flex items-center gap-3 mb-4">

                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">

                  <TrendingUp
                    size={22}
                    className="text-blue-300"
                  />

                </div>

                <span className="text-xs font-bold tracking-[0.2em] text-blue-300">
                  FINANCIAL ANALYTICS
                </span>

              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Analytics Overview
              </h1>

              <p className="text-slate-400 mt-2 max-w-2xl">
                Understand your financial performance,
                spending patterns and savings progress
                at a glance.
              </p>

            </div>

            {/* Budget Status */}

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 min-w-[230px]">

              <div className="flex items-center justify-between mb-3">

                <span className="text-xs text-slate-400">
                  Budget Health
                </span>

                <Target
                  size={18}
                  className="text-blue-300"
                />

              </div>

              <div className="flex items-end gap-2">

                <span className="text-3xl font-bold text-white">
                  {usageValue}%
                </span>

                <span className="text-xs text-slate-400 mb-1">
                  used
                </span>

              </div>

              <div className="w-full h-2 bg-white/10 rounded-full mt-4 overflow-hidden">

                <div
                  className={`h-full rounded-full ${getUsageColor()}`}
                  style={{
                    width: `${safeUsage}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-8">

        {/* ===============================================
            KPI CARDS
        =============================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

          {/* TOTAL INCOME */}

          <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">

                <Wallet
                  size={21}
                  className="text-emerald-600"
                />

              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">

                <ArrowUpRight size={13} />

                INCOME

              </div>

            </div>

            <p className="text-sm text-slate-500 mt-5">
              Total Income
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              ₹{totalIncome.toLocaleString()}
            </h2>

            <div className="flex items-center gap-1 mt-3 text-xs text-emerald-600">

              <TrendingUp size={13} />

              <span>
                Current monthly income
              </span>

            </div>

          </div>

          {/* TOTAL EXPENSES */}

          <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">

                <TrendingDown
                  size={21}
                  className="text-red-600"
                />

              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">

                <ArrowDownRight size={13} />

                EXPENSE

              </div>

            </div>

            <p className="text-sm text-slate-500 mt-5">
              Total Expenses
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              ₹{totalSpent.toLocaleString()}
            </h2>

            <div className="flex items-center gap-1 mt-3 text-xs text-red-600">

              <TrendingDown size={13} />

              <span>
                Money spent
              </span>

            </div>

          </div>

          {/* SAVINGS */}

          <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                <PiggyBank
                  size={21}
                  className="text-blue-600"
                />

              </div>

              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                {savingsRate}% RATE
              </span>

            </div>

            <p className="text-sm text-slate-500 mt-5">
              Total Savings
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              ₹{totalSavings.toLocaleString()}
            </h2>

            <div className="flex items-center gap-1 mt-3 text-xs text-blue-600">

              <PiggyBank size={13} />

              <span>
                Savings progress
              </span>

            </div>

          </div>

          {/* REMAINING */}

          <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">

                <Target
                  size={21}
                  className="text-purple-600"
                />

              </div>

              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                AVAILABLE
              </span>

            </div>

            <p className="text-sm text-slate-500 mt-5">
              Remaining Budget
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              ₹{totalRemaining.toLocaleString()}
            </h2>

            <div className="flex items-center gap-1 mt-3 text-xs text-purple-600">

              <Wallet size={13} />

              <span>
                Budget remaining
              </span>

            </div>

          </div>

        </div>

        {/* ===============================================
            CHARTS
        =============================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

          {/* =============================================
              REVENUE TREND
          ============================================= */}

          <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Revenue Trend
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Month-to-month income performance
                </p>

              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">

                <TrendingUp size={14} />

                Current Month Updates

              </div>

            </div>

            <div className="w-full h-[320px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={revenueData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 0,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#64748b",
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#64748b",
                      fontSize: 12,
                    }}
                    tickFormatter={(value) =>
                      `₹${value / 1000}k`
                    }
                  />

                  <Tooltip
                    formatter={(value) => [
                      `₹${Number(
                        value
                      ).toLocaleString()}`,
                      "Income",
                    ]}
                    contentStyle={{
                      borderRadius: "12px",
                      border:
                        "1px solid #e2e8f0",
                      boxShadow:
                        "0 10px 30px rgba(15,23,42,0.08)",
                    }}
                  />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Monthly Income"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: "#4f46e5",
                    }}
                    activeDot={{
                      r: 8,
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* =============================================
              EXPENSE CATEGORIES
          ============================================= */}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

            <div className="mb-4">

              <h2 className="text-xl font-bold text-slate-900">
                Expense Categories
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Where your money goes
              </p>

            </div>

            <div className="h-[240px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    label
                  >

                    {categoryData.map(
                      (entry, index) => (
                        <Cell
                          key={`category-${index}`}
                          fill={
                            COLORS[
                              index % COLORS.length
                            ]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

            {/* CATEGORY LEGEND */}

            <div className="space-y-3 mt-2">

              {categoryData.map(
                (item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >

                    <div className="flex items-center gap-2">

                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            COLORS[
                              index % COLORS.length
                            ],
                        }}
                      />

                      <span className="text-sm text-slate-600">
                        {item.name}
                      </span>

                    </div>

                    <span className="text-sm font-bold text-slate-800">
                      ₹
                      {Number(
                        item.value || 0
                      ).toLocaleString()}
                    </span>

                  </div>
                )
              )}

            </div>

          </div>

        </div>

        {/* ===============================================
            BUDGET PERFORMANCE
        =============================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* BUDGET PROGRESS */}

          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Budget Performance
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Your current monthly spending progress
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">

                <Target
                  size={21}
                  className="text-indigo-600"
                />

              </div>

            </div>

            <div className="flex items-end justify-between mb-3">

              <div>

                <p className="text-sm text-slate-500">
                  Spent
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  ₹{totalSpent.toLocaleString()}
                </p>

              </div>

              <div className="text-right">

                <p className="text-sm text-slate-500">
                  Budget
                </p>

                <p className="text-lg font-bold text-slate-700">
                  ₹{totalBudget.toLocaleString()}
                </p>

              </div>

            </div>

            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">

              <div
                className={`h-full rounded-full transition-all duration-700 ${getUsageColor()}`}
                style={{
                  width: `${safeUsage}%`,
                }}
              />

            </div>

            <div className="flex justify-between mt-3">

              <span className="text-xs text-slate-400">
                {getUsageMessage()}
              </span>

              <span className="text-xs font-bold text-slate-700">
                {usageValue}%
              </span>

            </div>

          </div>

          {/* SAVINGS RATE CARD */}

          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 rounded-3xl p-6 text-white">

            <div className="absolute -right-10 -top-10 w-36 h-36 bg-white/10 rounded-full" />

            <div className="absolute -left-10 -bottom-16 w-44 h-44 bg-white/5 rounded-full" />

            <div className="relative z-10">

              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-5">

                <PiggyBank size={21} />

              </div>

              <p className="text-sm text-blue-100">
                Savings Rate
              </p>

              <h2 className="text-4xl font-bold mt-1">
                {savingsRate}%
              </h2>

              <p className="text-sm text-blue-100 mt-4 leading-6">
                You're currently saving ₹
                {totalSavings.toLocaleString()}
                {" "}from your available income.
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm font-semibold">

                <CheckCircle2 size={17} />

                Keep building your savings

              </div>

            </div>

          </div>

        </div>

        {/* ===============================================
            RECENT TRANSACTIONS
        =============================================== */}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">

          <div className="p-6 border-b border-slate-100">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Recent Transactions
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Your latest financial activity
                </p>

              </div>

              <Wallet
                size={20}
                className="text-slate-400"
              />

            </div>

          </div>

          {/* DESKTOP TABLE */}

          <div className="hidden md:block overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                <TransactionRow
                  date="01 Jun"
                  category="Food"
                  amount="500"
                  status="Completed"
                  icon={Utensils}
                />

                <TransactionRow
                  date="05 Jun"
                  category="Transport"
                  amount="750"
                  status="Completed"
                  icon={Car}
                />

                <TransactionRow
                  date="12 Jun"
                  category="Shopping"
                  amount="2000"
                  status="Pending"
                  icon={ShoppingBag}
                />

                <TransactionRow
                  date="20 Jun"
                  category="Bills"
                  amount="1500"
                  status="Completed"
                  icon={Receipt}
                />

              </tbody>

            </table>

          </div>

          {/* MOBILE TRANSACTIONS */}

          <div className="md:hidden divide-y divide-slate-100">

            <MobileTransaction
              date="01 Jun"
              category="Food"
              amount="500"
              status="Completed"
              icon={Utensils}
            />

            <MobileTransaction
              date="05 Jun"
              category="Transport"
              amount="750"
              status="Completed"
              icon={Car}
            />

            <MobileTransaction
              date="12 Jun"
              category="Shopping"
              amount="2000"
              status="Pending"
              icon={ShoppingBag}
            />

            <MobileTransaction
              date="20 Jun"
              category="Bills"
              amount="1500"
              status="Completed"
              icon={Receipt}
            />

          </div>

        </div>

        {/* ===============================================
            AI INSIGHTS
        =============================================== */}

        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 rounded-3xl p-6 md:p-8 text-white">

          <div className="absolute -right-20 -top-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-2xl" />

          <div className="relative z-10">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-7">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">

                  <Brain
                    size={23}
                    className="text-blue-300"
                  />

                </div>

                <div>

                  <h2 className="text-xl font-bold">
                    AI Financial Insights
                  </h2>

                  <p className="text-sm text-slate-400 mt-1">
                    Smart observations based on your financial activity
                  </p>

                </div>

              </div>

              <span className="w-fit text-xs font-bold tracking-wider bg-blue-500/10 text-blue-300 border border-blue-400/10 px-3 py-2 rounded-lg">
                SMART ANALYSIS
              </span>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Insight
                icon={TrendingUp}
                title="Income Performance"
                text={`Your current recorded income is ₹${totalIncome.toLocaleString()}. Keep your income and savings goals aligned.`}
              />

              <Insight
                icon={PiggyBank}
                title="Savings Opportunity"
                text={`You're saving ₹${totalSavings.toLocaleString()}. Consider increasing your savings target gradually.`}
              />

              <Insight
                icon={AlertTriangle}
                title="Spending Alert"
                text={
                  usageValue >= 70
                    ? "Your spending is approaching the budget limit. Review high-cost categories."
                    : "Your spending is currently within a comfortable range."
                }
              />

              <Insight
                icon={Target}
                title="Budget Recommendation"
                text="Review your category allocations every month and move unused budget toward savings."
              />

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="py-8 text-center text-xs text-slate-400">
          Make smarter decisions today for a stronger financial future.
        </div>

      </main>

    </div>
  );
}


/* =========================================================
   TRANSACTION ROW
========================================================= */

function TransactionRow({
  date,
  category,
  amount,
  status,
  icon: Icon,
}) {
  return (
    <tr className="hover:bg-slate-50 transition">

      <td className="px-6 py-4 text-sm text-slate-600">
        {date}
      </td>

      <td className="px-6 py-4">

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">

            <Icon
              size={16}
              className="text-indigo-600"
            />

          </div>

          <span className="text-sm font-semibold text-slate-700">
            {category}
          </span>

        </div>

      </td>

      <td className="px-6 py-4 text-sm font-bold text-red-600">
        -₹{Number(amount).toLocaleString()}
      </td>

      <td className="px-6 py-4">

        {status === "Completed" ? (

          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">

            <CheckCircle2 size={13} />

            Completed

          </span>

        ) : (

          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full">

            <Clock3 size={13} />

            Pending

          </span>

        )}

      </td>

    </tr>
  );
}


/* =========================================================
   MOBILE TRANSACTION
========================================================= */

function MobileTransaction({
  date,
  category,
  amount,
  status,
  icon: Icon,
}) {
  return (
    <div className="p-5 flex items-center justify-between gap-4">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">

          <Icon
            size={17}
            className="text-indigo-600"
          />

        </div>

        <div>

          <p className="font-semibold text-slate-800">
            {category}
          </p>

          <p className="text-xs text-slate-400 mt-1">
            {date}
          </p>

        </div>

      </div>

      <div className="text-right">

        <p className="font-bold text-red-600">
          -₹{Number(amount).toLocaleString()}
        </p>

        <p
          className={`text-xs mt-1 ${
            status === "Completed"
              ? "text-emerald-600"
              : "text-yellow-600"
          }`}
        >
          {status}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   AI INSIGHT
========================================================= */

function Insight({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition">

      <div className="flex items-start gap-4">

        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">

          <Icon
            size={18}
            className="text-blue-300"
          />

        </div>

        <div>

          <h3 className="font-bold text-white">
            {title}
          </h3>

          <p className="text-sm text-slate-400 leading-6 mt-1">
            {text}
          </p>

        </div>

      </div>

    </div>
  );
}


export default Analytics;