
import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Minimum 3 characters")
        .required("Name is required"),

      mobile: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .required("Mobile number is required"),

      email: Yup.string()
        .email("Enter a valid email address")
        .required("Email is required"),

      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/,
          "Use uppercase, lowercase and number"
        )
        .required("Password is required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required("Please confirm your password"),
    }),

    onSubmit: async (values) => {
      if (!acceptTerms) {
        alert("Please accept the Terms & Conditions.");
        return;
      }

      setIsLoading(true);

      try {
        await apiRequest("/auth/register", {
          method: "POST",
          body: JSON.stringify({
            name: values.name.trim(),
            email: values.email.trim().toLowerCase(),
            password: values.password,
          }),
        });

        alert("Registration successful! Please login.");
        formik.resetForm();
        setAcceptTerms(false);
        navigate("/login");
      } catch (requestError) {
        alert(requestError.message);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const getPasswordStrength = () => {
    const password = formik.values.password;

    if (!password) {
      return {
        label: "",
        width: "0%",
        className: "bg-gray-200",
      };
    }

    let score = 0;

    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return {
        label: "Weak",
        width: "35%",
        className: "bg-red-500",
      };
    }

    if (score <= 4) {
      return {
        label: "Medium",
        width: "70%",
        className: "bg-yellow-500",
      };
    }

    return {
      label: "Strong",
      width: "100%",
      className: "bg-green-500",
    };
  };

  const passwordStrength = getPasswordStrength();

  const inputClass = (field) =>
    `w-full h-12 pl-11 pr-4 rounded-xl border bg-white/80 text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 ${
      formik.touched[field] && formik.errors[field]
        ? "border-red-400 focus:ring-4 focus:ring-red-100"
        : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
    }`;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">

      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

        {/* =====================================================
            LEFT SIDE - BRANDING
        ====================================================== */}
        <div className="hidden lg:flex lg:w-[43%] relative bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white p-12 flex-col justify-between overflow-hidden">

          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-72 h-72 border border-white/10 rounded-full" />
          <div className="absolute top-10 -right-10 w-52 h-52 border border-white/10 rounded-full" />
          <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-white/5 rounded-full" />

          <div className="relative z-10">

            {/* Logo */}
            <div className="flex items-center gap-3 mb-14">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                <span className="text-2xl">💰</span>
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

            {/* Main heading */}
            <div>
              <p className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-blue-100 text-xs font-semibold mb-5">
                ✨ SMART MONEY MANAGEMENT
              </p>

              <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
                Take control of
                <span className="block text-blue-200">
                  your finances.
                </span>
              </h2>

              <p className="text-blue-100/80 mt-6 leading-7 max-w-md">
                Create your account and start managing your income,
                expenses, budgets and savings from one powerful dashboard.
              </p>
            </div>

            {/* Features */}
            <div className="mt-10 space-y-4">

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  📊
                </div>

                <div>
                  <h3 className="font-semibold">
                    Smart Analytics
                  </h3>
                  <p className="text-sm text-blue-200">
                    Understand your spending habits
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  🎯
                </div>

                <div>
                  <h3 className="font-semibold">
                    Budget Tracking
                  </h3>
                  <p className="text-sm text-blue-200">
                    Stay on track with your goals
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  🔒
                </div>

                <div>
                  <h3 className="font-semibold">
                    Secure Account
                  </h3>
                  <p className="text-sm text-blue-200">
                    Your financial information stays protected
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom quote */}
          <div className="relative z-10 border-t border-white/10 pt-6">
            <p className="text-sm text-blue-100 italic">
              "Small savings today create a stronger financial future."
            </p>
          </div>
        </div>

        {/* =====================================================
            RIGHT SIDE - REGISTER FORM
        ====================================================== */}
        <div className="w-full lg:w-[57%] p-6 sm:p-8 md:p-12">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-xl">💰</span>
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
          <div className="mb-8">
            <p className="text-sm font-semibold text-blue-600 mb-2">
              GET STARTED
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Create your account
            </h2>

            <p className="text-gray-500 mt-2">
              Join Budget AI and start your smarter financial journey.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5">

            {/* Name + Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    👤
                  </span>

                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClass("name")}
                  />
                </div>

                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {formik.errors.name}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number
                </label>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    📱
                  </span>

                  <input
                    type="tel"
                    name="mobile"
                    placeholder="9876543210"
                    maxLength="10"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClass("mobile")}
                  />
                </div>

                {formik.touched.mobile && formik.errors.mobile && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {formik.errors.mobile}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  ✉️
                </span>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputClass("email")}
                />
              </div>

              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs mt-1.5">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  🔒
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${inputClass("password")} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Password strength */}
              {formik.values.password && (
                <div className="mt-2">

                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">
                      Password strength
                    </span>

                    <span className="text-xs font-semibold text-gray-600">
                      {passwordStrength.label}
                    </span>
                  </div>

                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.className} transition-all duration-300`}
                      style={{
                        width: passwordStrength.width,
                      }}
                    />
                  </div>

                </div>
              )}

              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs mt-1.5">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  🔐
                </span>

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${inputClass("confirmPassword")} pr-12`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">

              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 accent-blue-600 cursor-pointer"
              />

              <label
                htmlFor="terms"
                className="text-sm text-gray-500 leading-5 cursor-pointer"
              >
                I agree to the{" "}
                <span className="text-blue-600 font-semibold">
                  Terms & Conditions
                </span>{" "}
                and{" "}
                <span className="text-blue-600 font-semibold">
                  Privacy Policy
                </span>
                .
              </label>

            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-13 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account
                  <span>→</span>
                </span>
              )}
            </button>

            {/* Login */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-gray-400">
                  ALREADY A MEMBER?
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition"
              >
                Sign in
              </button>
            </p>

          </form>

          {/* Security footer */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
            <span>🔒</span>
            Your information is protected
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;