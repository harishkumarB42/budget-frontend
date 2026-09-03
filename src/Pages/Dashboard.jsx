
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  BarChart3,
  User,
  Wallet,
  Brain,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Menu,
  X,
  LogOut,
  Settings,
  Sparkles,
  ChevronRight,
  CircleDollarSign,
  Activity,
} from "lucide-react";
import { useBudgetData } from "../context/BudgetContext";

function Dashboard() {
  const [currentUser, setCurrentUser] = useState({});
  const [mobileMenu, setMobileMenu] = useState(false);
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    budgetData,
    spent,
    savings,
    remaining,
    usage,
    transactions,
  } = useBudgetData();

  useEffect(() => {
    const user =
      JSON.parse(localStorage.getItem("currentUser")) || {};

    setCurrentUser(user);
  }, []);

  /* ==========================================================
     CALCULATIONS
  ========================================================== */

  const income = Number(budgetData?.income ?? budgetData?.salary ?? 0);
  const budget = Number(budgetData?.budget || 0);
  const expenses = Number(spent || 0);
  const saved = Number(savings || 0);
  const left = Number(remaining || 0);

  const progress =
    budget > 0
      ? Math.min((expenses / budget) * 100, 100)
      : 0;

  const savingsPercentage =
    income > 0
      ? Math.max(0, Math.min((saved / income) * 100, 100))
      : 0;

  const remainingPercentage =
    budget > 0
      ? Math.max(0, Math.min((left / budget) * 100, 100))
      : 0;

  /* ==========================================================
     NAVIGATION
  ========================================================== */

  const navItems = [
    {
      label: "Dashboard",
      icon: Home,
      to: "/",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      to: "/analytics",
    },
    {
      label: "Budgets",
      icon: Wallet,
      to: "/budgets",
    },
    {
      label: "Profile",
      icon: User,
      to: "/profile",
    },
  ];

  /* ==========================================================
     AI SUGGESTION
  ========================================================== */

  const generateSuggestion = () => {
    if (!question.trim()) {
      setAiResponse(
        "Please enter a question so Budget AI can help you."
      );
      return;
    }

    setIsGenerating(true);
    setAiResponse("");

    setTimeout(() => {
      const lowerQuestion = question.toLowerCase();

      let response = "";

      if (
        lowerQuestion.includes("saving") ||
        lowerQuestion.includes("save")
      ) {
        response =
          saved > 0
            ? `You're currently saving ₹${saved.toLocaleString()}. Based on your income and expenses, try setting aside at least 20% of your monthly income before spending on non-essential items.`
            : "Start by creating a small savings target. Even saving 10% of your monthly income consistently can build a strong financial habit.";
      } else if (
        lowerQuestion.includes("expense") ||
        lowerQuestion.includes("spending")
      ) {
        response =
          progress > 80
            ? `Your spending has reached ${progress.toFixed(
                0
              )}% of your budget. Consider reviewing unnecessary expenses and reducing non-essential spending.`
            : `Your spending is currently at ${progress.toFixed(
                0
              )}% of your budget. You're within a reasonable range, but continue monitoring your expenses.`;
      } else if (
        lowerQuestion.includes("budget")
      ) {
        response =
          budget > 0
            ? `Your monthly budget is ₹${budget.toLocaleString()} and you've used ₹${expenses.toLocaleString()}. You have ₹${left.toLocaleString()} remaining.`
            : "Set a monthly budget to start receiving personalized financial recommendations.";
      } else {
        response = `Based on your current financial overview, you have ₹${left.toLocaleString()} remaining from your budget and ₹${saved.toLocaleString()} in savings. Focus on controlling unnecessary expenses and maintaining consistent savings.`;
      }

      setAiResponse(response);
      setIsGenerating(false);
    }, 900);
  };

  /* ==========================================================
     LOGOUT
  ========================================================== */

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  /* ==========================================================
     TRANSACTIONS
  ========================================================== */

  /* ==========================================================
     SIDEBAR
  ========================================================== */

  const Sidebar = ({ mobile = false }) => (
    <aside
      className={`${
        mobile
          ? "fixed inset-y-0 left-0 z-50 w-72"
          : "hidden lg:flex w-72 min-h-screen"
      } bg-slate-950 text-white flex-col border-r border-white/10`}
    >
      {/* Logo */}

      <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <CircleDollarSign size={25} />
          </div>

          <div>
            <h1 className="text-lg font-bold">
              Budget AI
            </h1>

            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
              Smart Finance
            </p>
          </div>

        </div>

        {mobile && (
          <button
            onClick={() => setMobileMenu(false)}
            className="p-2 rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        )}

      </div>

      {/* Navigation */}

      <div className="flex-1 px-4 py-7">

        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 px-3 mb-3">
          Main Menu
        </p>

        <nav className="space-y-2">

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() =>
                  mobile && setMobileMenu(false)
                }
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <Icon size={19} />

                <span className="font-medium text-sm">
                  {item.label}
                </span>

                {item.to === "/" && (
                  <span className="ml-auto w-1.5 h-1.5 bg-blue-300 rounded-full" />
                )}
              </NavLink>
            );
          })}

        </nav>

        {/* AI Banner */}

        <div className="mt-10 p-4 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-purple-600/20 border border-indigo-400/20">

          <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-3">
            <Sparkles size={18} className="text-indigo-300" />
          </div>

          <h3 className="font-semibold text-sm">
            Budget AI Assistant
          </h3>

          <p className="text-xs text-slate-400 mt-1 leading-5">
            Get smarter insights about your spending and savings.
          </p>

          <button
            onClick={() => {
              mobile && setMobileMenu(false);
              document
                .getElementById("ask-ai")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
            className="mt-4 text-xs font-semibold text-indigo-300 flex items-center gap-1 hover:text-white"
          >
            Ask AI
            <ChevronRight size={14} />
          </button>

        </div>

      </div>

      {/* User section */}

      <div className="p-4 border-t border-white/10">

        <NavLink
          to="/profile"
          onClick={() =>
            mobile && setMobileMenu(false)
          }
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition"
        >

          {currentUser?.profileImage ? (
            <img
              src={currentUser.profileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
              {currentUser?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>
          )}

          <div className="flex-1 min-w-0">

            <p className="text-sm font-semibold truncate">
              {currentUser?.name || "User"}
            </p>

            <p className="text-xs text-slate-500 truncate">
              {currentUser?.email || "Account"}
            </p>

          </div>

          <Settings
            size={17}
            className="text-slate-500"
          />

        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition text-sm"
        >
          <LogOut size={17} />
          Logout
        </button>

      </div>
    </aside>
  );

  /* ==========================================================
     DASHBOARD
  ========================================================== */

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* Desktop Sidebar */}

      <Sidebar />

      {/* Mobile Sidebar */}

      {mobileMenu && (
        <>
          <Sidebar mobile />

          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenu(false)}
          />
        </>
      )}

      {/* Main */}

      <main className="flex-1 min-w-0">

        {/* ====================================================
            TOP HEADER
        ===================================================== */}

        <header className="h-20 bg-white border-b border-slate-200 px-5 md:px-8 flex items-center justify-between sticky top-0 z-30">

          <div className="flex items-center gap-4">

            <button
              onClick={() => setMobileMenu(true)}
              className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700"
            >
              <Menu size={21} />
            </button>

            <div>
              <p className="text-xs text-slate-400 font-medium">
                FINANCIAL DASHBOARD
              </p>

              <h1 className="text-lg md:text-xl font-bold text-slate-900">
                Overview
              </h1>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden sm:block text-right">

              <p className="text-sm font-semibold text-slate-800">
                {currentUser?.name || "User"}
              </p>

              <p className="text-xs text-slate-400">
                Personal Account
              </p>

            </div>

            <NavLink to="/profile">

              {currentUser?.profileImage ? (
                <img
                  src={currentUser.profileImage}
                  alt="Profile"
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                  {currentUser?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </div>
              )}

            </NavLink>

          </div>

        </header>

        {/* Content */}

        <div className="p-5 md:p-8 max-w-[1600px] mx-auto">

          {/* ==================================================
              WELCOME
          =================================================== */}

          <div className="mb-7">

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

              <div>

                <p className="text-sm font-medium text-blue-600 mb-1">
                  Good to see you 👋
                </p>

                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Welcome back,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    {currentUser?.name || "User"}
                  </span>
                </h2>

                <p className="text-slate-500 mt-2 text-sm">
                  Here's what's happening with your finances today.
                </p>

              </div>

              <NavLink
                to="/budgets"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition shadow-lg"
              >
                <Wallet size={17} />
                Manage Budget
              </NavLink>

            </div>

          </div>

          {/* ==================================================
              TOP STATISTICS
          =================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {/* Income */}

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

              <div className="flex items-center justify-between">

                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <ArrowUpRight
                    size={21}
                    className="text-emerald-600"
                  />
                </div>

                <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  INCOME
                </span>

              </div>

              <p className="text-sm text-slate-500 mt-5">
                Total Income
              </p>

              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                ₹{income.toLocaleString()}
              </h3>

              <div className="flex items-center gap-1 mt-3 text-xs text-emerald-600 font-medium">
                <TrendingUp size={14} />
                Available monthly income
              </div>

            </div>

            {/* Expenses */}

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

              <div className="flex items-center justify-between">

                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                  <ArrowDownRight
                    size={21}
                    className="text-red-600"
                  />
                </div>

                <span className="text-[10px] font-bold tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                  EXPENSES
                </span>

              </div>

              <p className="text-sm text-slate-500 mt-5">
                Total Expenses
              </p>

              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                ₹{expenses.toLocaleString()}
              </h3>

              <div className="flex items-center gap-1 mt-3 text-xs text-red-500 font-medium">
                <Activity size={14} />
                {progress.toFixed(0)}% of budget used
              </div>

            </div>

            {/* Savings */}

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

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
                Total Savings
              </p>

              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                ₹{saved.toLocaleString()}
              </h3>

              <div className="flex items-center gap-1 mt-3 text-xs text-blue-600 font-medium">
                <TrendingUp size={14} />
                {savingsPercentage.toFixed(1)}% of income
              </div>

            </div>

            {/* Remaining */}

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

              <div className="flex items-center justify-between">

                <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Wallet
                    size={21}
                    className="text-purple-600"
                  />
                </div>

                <span className="text-[10px] font-bold tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                  REMAINING
                </span>

              </div>

              <p className="text-sm text-slate-500 mt-5">
                Budget Remaining
              </p>

              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                ₹{left.toLocaleString()}
              </h3>

              <div className="flex items-center gap-1 mt-3 text-xs text-purple-600 font-medium">
                <Activity size={14} />
                {remainingPercentage.toFixed(0)}% available
              </div>

            </div>

          </div>

          {/* ==================================================
              BUDGET + SAVINGS
          =================================================== */}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">

            {/* Spending Progress */}

            <div className="xl:col-span-2 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">

              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full border border-white/10" />

              <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-white/5" />

              <div className="relative z-10">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <div className="flex items-center gap-2 text-blue-100 text-sm font-medium">
                      <Wallet size={17} />
                      Monthly Budget
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mt-3">
                      ₹{expenses.toLocaleString()}
                    </h2>

                    <p className="text-blue-100 mt-2 text-sm">
                      of ₹{budget.toLocaleString()} budget used
                    </p>

                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <BarChart3 size={27} />
                  </div>

                </div>

                {/* Progress */}

                <div className="mt-8">

                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-blue-100">
                      Spending progress
                    </span>

                    <span className="font-bold">
                      {progress.toFixed(1)}%
                    </span>
                  </div>

                  <div className="h-3 bg-white/15 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-white rounded-full transition-all duration-700"
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                  </div>

                </div>

                <div className="grid grid-cols-2 gap-4 mt-7">

                  <div className="bg-white/10 rounded-2xl p-4">
                    <p className="text-xs text-blue-100">
                      Spent
                    </p>

                    <p className="text-lg font-bold mt-1">
                      ₹{expenses.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-4">
                    <p className="text-xs text-blue-100">
                      Remaining
                    </p>

                    <p className="text-lg font-bold mt-1">
                      ₹{left.toLocaleString()}
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* Savings Card */}

            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Savings Rate
                  </p>

                  <h2 className="text-3xl font-bold text-slate-900 mt-1">
                    {savingsPercentage.toFixed(1)}%
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <PiggyBank
                    size={23}
                    className="text-blue-600"
                  />
                </div>

              </div>

              {/* Circular-style visual */}

              <div className="mt-7">

                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700"
                    style={{
                      width: `${savingsPercentage}%`,
                    }}
                  />

                </div>

              </div>

              <div className="mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-100">

                <div className="flex gap-3">

                  <Sparkles
                    size={19}
                    className="text-blue-600 mt-0.5"
                  />

                  <div>

                    <p className="text-sm font-semibold text-blue-900">
                      Savings insight
                    </p>

                    <p className="text-xs text-blue-700 mt-1 leading-5">
                      {savingsPercentage >= 20
                        ? "Great work! You're maintaining a healthy savings rate."
                        : "Try increasing your savings gradually to build a stronger financial cushion."}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ==================================================
              AI SECTION
          =================================================== */}

          <div
            id="ask-ai"
            className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-5"
          >

            {/* AI Insights */}

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-7">

              <div className="flex items-center justify-between mb-6">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Brain
                      size={22}
                      className="text-indigo-600"
                    />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      AI Financial Insights
                    </h2>

                    <p className="text-xs text-slate-400">
                      Personalized observations
                    </p>
                  </div>

                </div>

                <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  AI ACTIVE
                </span>

              </div>

              <div className="space-y-3">

                <div className="flex gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">

                  <div className="text-xl">
                    📈
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Income Overview
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 leading-5">
                      Your current income is ₹
                      {income.toLocaleString()}. Keep your
                      monthly income and expense records updated.
                    </p>
                  </div>

                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100">

                  <div className="text-xl">
                    💰
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Savings Performance
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 leading-5">
                      You're currently saving ₹
                      {saved.toLocaleString()}. A consistent
                      savings habit can improve your financial stability.
                    </p>
                  </div>

                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-100">

                  <div className="text-xl">
                    ⚠️
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Spending Check
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 leading-5">
                      You've used {progress.toFixed(0)}% of
                      your monthly budget. Monitor discretionary
                      spending as you approach your limit.
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* Ask AI */}

            <div className="bg-slate-950 rounded-3xl p-6 md:p-7 text-white relative overflow-hidden">

              <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl" />

              <div className="relative z-10">

                <div className="flex items-center gap-3 mb-6">

                  <div className="w-11 h-11 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <Sparkles
                      size={21}
                      className="text-indigo-300"
                    />
                  </div>

                  <div>

                    <h2 className="font-bold">
                      Ask Budget AI
                    </h2>

                    <p className="text-xs text-slate-400">
                      Get instant financial guidance
                    </p>

                  </div>

                </div>

                <textarea
                  value={question}
                  onChange={(e) =>
                    setQuestion(e.target.value)
                  }
                  placeholder="Example: How can I save more money this month?"
                  className="w-full h-28 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-slate-500 resize-none outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition"
                />

                <button
                  onClick={generateSuggestion}
                  disabled={isGenerating}
                  className="mt-4 w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold text-sm transition disabled:opacity-60"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing your finances...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Brain size={17} />
                      Generate Suggestion
                    </span>
                  )}
                </button>

                {aiResponse && (
                  <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10">

                    <div className="flex gap-3">

                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        🤖
                      </div>

                      <div>

                        <p className="text-xs text-indigo-300 font-semibold mb-1">
                          Budget AI
                        </p>

                        <p className="text-sm text-slate-300 leading-6">
                          {aiResponse}
                        </p>

                      </div>

                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>

          {/* ==================================================
              RECENT TRANSACTIONS
          =================================================== */}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm mt-5 overflow-hidden">

            <div className="p-6 md:p-7 flex items-center justify-between border-b border-slate-100">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Recent Transactions
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Your latest recorded expenses
                </p>

              </div>

              <NavLink
                to="/analytics"
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View Analytics
                <ChevronRight size={16} />
              </NavLink>

            </div>

            {/* Desktop Table */}

            <div className="hidden md:block overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400">

                    <th className="text-left px-7 py-4 font-semibold">
                      Transaction
                    </th>

                    <th className="text-left px-7 py-4 font-semibold">
                      Category
                    </th>

                    <th className="text-left px-7 py-4 font-semibold">
                      Amount
                    </th>

                    <th className="text-left px-7 py-4 font-semibold">
                      Date
                    </th>

                    <th className="text-right px-7 py-4 font-semibold">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {transactions.map((transaction) => (

                    <tr
                      key={transaction.title}
                      className="border-t border-slate-100 hover:bg-slate-50 transition"
                    >

                      <td className="px-7 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                            {transaction.icon}
                          </div>

                          <span className="font-semibold text-sm text-slate-800">
                            {transaction.title}
                          </span>

                        </div>

                      </td>

                      <td className="px-7 py-4">

                        <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                          {transaction.category}
                        </span>

                      </td>

                      <td className="px-7 py-4">

                        <span className="font-bold text-red-600">
                          -₹{transaction.amount.toLocaleString()}
                        </span>

                      </td>

                      <td className="px-7 py-4 text-sm text-slate-500">
                        {transaction.date}
                      </td>

                      <td className="px-7 py-4 text-right">

                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-semibold">

                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />

                          Completed

                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* Mobile Transactions */}

            <div className="md:hidden divide-y divide-slate-100">

              {transactions.map((transaction) => (

                <div
                  key={transaction.title}
                  className="p-5 flex items-center gap-3"
                >

                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                    {transaction.icon}
                  </div>

                  <div className="flex-1 min-w-0">

                    <p className="font-semibold text-sm text-slate-800">
                      {transaction.title}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      {transaction.category} •{" "}
                      {transaction.date}
                    </p>

                  </div>

                  <p className="font-bold text-sm text-red-600">
                    -₹{transaction.amount.toLocaleString()}
                  </p>

                </div>

              ))}

            </div>

          </div>

          {/* ==================================================
              FOOTER
          =================================================== */}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-7 text-xs text-slate-400">

            <p>
              © 2026 Budget AI. Smart financial management.
            </p>

            <div className="flex items-center gap-4">

              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                All systems operational
              </span>

              <NavLink
                to="/profile"
                className="hover:text-slate-600"
              >
                Account Settings
              </NavLink>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;