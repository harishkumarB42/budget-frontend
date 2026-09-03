import { NavLink, useLocation } from "react-router-dom";
import {
  WalletCards,
  Home,
  BarChart3,
  Wallet,
  User,
  LogIn,
  UserPlus,
} from "lucide-react";

function Navbar() {
  const location = useLocation();

  const navStyle = ({ isActive }) =>
    `relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
      isActive
        ? "text-yellow-400 bg-white/10"
        : "text-slate-300 hover:text-white hover:bg-white/5"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-white/10 shadow-lg">

      <div className="max-w-7xl mx-auto px-5 md:px-8">

        <div className="h-20 flex items-center justify-between">

          {/* =================================================
              LOGO
          ================================================= */}
          <NavLink
            to="/"
            className="flex items-center gap-3 group"
          >

            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <WalletCards
                size={22}
                className="text-white"
              />
            </div>

            <div className="hidden sm:block">

              <h1 className="text-lg font-bold text-white tracking-tight">
                Budget<span className="text-blue-400">AI</span>
              </h1>

              <p className="text-[9px] tracking-[0.2em] text-slate-500 font-semibold">
                SMART FINANCE
              </p>

            </div>

          </NavLink>


          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}
          <div className="hidden md:flex items-center gap-1">

            <NavLink
              to="/"
              className={navStyle}
            >
              <Home size={16} />
              Home
            </NavLink>

            <NavLink
              to="/analytics"
              className={navStyle}
            >
              <BarChart3 size={16} />
              Analytics
            </NavLink>

            <NavLink
              to="/budgets"
              className={navStyle}
            >
              <Wallet size={16} />
              Budgets
            </NavLink>

            <NavLink
              to="/profile"
              className={navStyle}
            >
              <User size={16} />
              Profile
            </NavLink>

          </div>


          {/* =================================================
              AUTH BUTTONS
          ================================================= */}
          <div className="flex items-center gap-2">

            <NavLink
              to="/login"
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              <LogIn size={16} />
              Login
            </NavLink>

            <NavLink
              to="/register"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300"
            >
              <UserPlus size={16} />
              <span className="hidden sm:inline">
                Register
              </span>
              <span className="sm:hidden">
                Sign Up
              </span>
            </NavLink>

          </div>

        </div>

      </div>


      {/* =====================================================
          MOBILE NAVIGATION
      ===================================================== */}
      <div className="md:hidden border-t border-white/5 bg-slate-950">

        <div className="flex items-center justify-center gap-1 px-3 py-2 overflow-x-auto">

          <NavLink
            to="/"
            className={navStyle}
          >
            <Home size={15} />
            Home
          </NavLink>

          <NavLink
            to="/analytics"
            className={navStyle}
          >
            <BarChart3 size={15} />
            Analytics
          </NavLink>

          <NavLink
            to="/budgets"
            className={navStyle}
          >
            <Wallet size={15} />
            Budgets
          </NavLink>

          <NavLink
            to="/profile"
            className={navStyle}
          >
            <User size={15} />
            Profile
          </NavLink>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;