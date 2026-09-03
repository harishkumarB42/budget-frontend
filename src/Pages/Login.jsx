
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);

    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: email.trim(), password }),
    })
      .then(({ token, user }) => {
        localStorage.setItem("authToken", token);
        localStorage.setItem("currentUser", JSON.stringify(user));

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email.trim());
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        navigate("/");
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  };

  // Load remembered email
  React.useEffect(() => {
    const rememberedEmail =
      localStorage.getItem("rememberedEmail");

    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">

      {/* =====================================================
          BACKGROUND DECORATIONS
      ====================================================== */}

      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />

      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

        {/* =====================================================
            LEFT SIDE - BRANDING
        ====================================================== */}

        <div className="hidden lg:flex lg:w-[45%] relative bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white p-12 flex-col justify-between overflow-hidden">

          {/* Decorative circles */}

          <div className="absolute -top-24 -right-24 w-80 h-80 border border-white/10 rounded-full" />

          <div className="absolute top-10 -right-12 w-56 h-56 border border-white/10 rounded-full" />

          <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-white/5 rounded-full" />

          <div className="relative z-10">

            {/* Logo */}

            <div className="flex items-center gap-3 mb-16">

              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                <span className="text-2xl">
                  💰
                </span>
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Budget AI
                </h1>

                <p className="text-blue-200 text-xs">
                  Smart Financial Management
                </p>
              </div>

            </div>

            {/* Heading */}

            <div>

              <p className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-blue-100 text-xs font-semibold mb-5">
                ✨ WELCOME BACK
              </p>

              <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
                Your money.
                <span className="block text-blue-200">
                  Your future.
              </span>
              </h2>

              <p className="text-blue-100/80 mt-6 leading-7 max-w-md">
                Log in to your Budget AI account and continue
                managing your income, expenses, budgets and
                savings from one intelligent dashboard.
              </p>

            </div>

            {/* Features */}

            <div className="mt-12 space-y-5">

              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                  📊
                </div>

                <div>
                  <h3 className="font-semibold">
                    Track Your Finances
                  </h3>

                  <p className="text-sm text-blue-200">
                    Monitor income and expenses easily
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                  🎯
                </div>

                <div>
                  <h3 className="font-semibold">
                    Reach Your Goals
                  </h3>

                  <p className="text-sm text-blue-200">
                    Build better saving habits
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                  🤖
                </div>

                <div>
                  <h3 className="font-semibold">
                    AI-Powered Insights
                  </h3>

                  <p className="text-sm text-blue-200">
                    Make smarter financial decisions
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Bottom */}

          <div className="relative z-10 border-t border-white/10 pt-6">

            <p className="text-sm text-blue-100 italic">
              "Smart financial decisions start with
              understanding your money."
            </p>

          </div>

        </div>

        {/* =====================================================
            RIGHT SIDE - LOGIN
        ====================================================== */}

        <div className="w-full lg:w-[55%] p-6 sm:p-8 md:p-12">

          {/* Mobile Logo */}

          <div className="flex lg:hidden items-center gap-3 mb-10">

            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <span className="text-xl">
                💰
              </span>
            </div>

            <div>

              <h1 className="font-bold text-xl text-gray-900">
                Budget AI
              </h1>

              <p className="text-xs text-gray-500">
                Smart Financial Management
              </p>

            </div>

          </div>

          {/* Header */}

          <div className="mb-9">

            <p className="text-sm font-semibold text-blue-600 mb-2">
              WELCOME BACK
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Sign in to your account
            </h2>

            <p className="text-gray-500 mt-3">
              Enter your details to access your financial dashboard.
            </p>

          </div>

          {/* Error */}

          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">

              <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                ⚠️
              </div>

              <div>
                <p className="text-sm font-semibold text-red-700">
                  Login failed
                </p>

                <p className="text-xs text-red-600 mt-0.5">
                  {error}
                </p>
              </div>

            </div>
          )}

          {/* =====================================================
              FORM
          ====================================================== */}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Email */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ✉️
                </span>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="w-full h-13 px-4 pl-12 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  autoComplete="email"
                />

              </div>

            </div>

            {/* Password */}

            <div>

              <div className="flex items-center justify-between mb-2">

                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>

                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Password recovery will be available when the backend email service is connected."
                    )
                  }
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </button>

              </div>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔒
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full h-13 px-4 pl-12 pr-12 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>

            </div>

            {/* Remember Me */}

            <div className="flex items-center justify-between pt-1">

              <label className="flex items-center gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />

                <span className="text-sm text-gray-500">
                  Remember me
                </span>

              </label>

            </div>

            {/* Login Button */}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-13 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >

              {isLoading ? (
                <span className="flex items-center justify-center gap-2">

                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                  Signing in...

                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <span>→</span>
                </span>
              )}

            </button>

            {/* Divider */}

            <div className="relative my-7">

              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-gray-400">
                  NEW TO BUDGET AI?
                </span>
              </div>

            </div>

            {/* Register */}

            <p className="text-center text-sm text-gray-500">

              Don't have an account?{" "}

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition"
              >
                Create an account
              </button>

            </p>

          </form>

          {/* Security */}

          <div className="mt-9 flex items-center justify-center gap-2 text-xs text-gray-400">

            <span>🔒</span>

            <span>
              Your account information is securely protected
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;
