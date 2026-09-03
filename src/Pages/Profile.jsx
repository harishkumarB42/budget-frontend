
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBudgetData } from "../context/BudgetContext";

function Profile() {
  const navigate = useNavigate();
  const { budgetData, income, spent, savings } = useBudgetData();
  const fileInputRef = useRef(null);

  // =========================================================
  // USER
  // =========================================================

  const [currentUser, setCurrentUser] = useState(null);

  // =========================================================
  // PROFILE
  // =========================================================

  const [isEditMode, setIsEditMode] = useState(false);

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [profileImage, setProfileImage] = useState(null);

  // =========================================================
  // SETTINGS
  // =========================================================

  const [activeSetting, setActiveSetting] = useState(null);

  // =========================================================
  // PASSWORD
  // =========================================================

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    budgetAlerts: true,
    expenseAlerts: true,
    monthlyReport: true,
  });

  // =========================================================
  // DELETE
  // =========================================================

  const [deleteConfirm, setDeleteConfirm] = useState("");

  // =========================================================
  // LOAD USER
  // =========================================================

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("currentUser")
    );

    if (storedUser && storedUser.email) {
      setCurrentUser(storedUser);

      setEditData({
        name: storedUser.name || "",
        email: storedUser.email || "",
        mobile: storedUser.mobile || "",
      });

      setProfileImage(storedUser.profileImage || null);

      if (storedUser.notifications) {
        setNotifications({
          emailNotifications:
            storedUser.notifications.emailNotifications ?? true,

          budgetAlerts:
            storedUser.notifications.budgetAlerts ?? true,

          expenseAlerts:
            storedUser.notifications.expenseAlerts ?? true,

          monthlyReport:
            storedUser.notifications.monthlyReport ?? true,
        });
      }
    }
  }, []);

  // =========================================================
  // PROFILE IMAGE
  // =========================================================

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageData = reader.result;

      setProfileImage(imageData);

      const updatedUser = {
        ...currentUser,
        profileImage: imageData,
      };

      localStorage.setItem(
        "currentUser",
        JSON.stringify(updatedUser)
      );

      setCurrentUser(updatedUser);
    };

    reader.readAsDataURL(file);
  };

  // =========================================================
  // REMOVE IMAGE
  // =========================================================

  const handleRemoveImage = () => {
    const updatedUser = {
      ...currentUser,
      profileImage: null,
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedUser)
    );

    setCurrentUser(updatedUser);
    setProfileImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSaveProfile = () => {
    if (!editData.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!editData.email.trim()) {
      alert("Please enter your email.");
      return;
    }

    const updatedUser = {
      ...currentUser,
      name: editData.name.trim(),
      email: editData.email.trim(),
      mobile: editData.mobile.trim(),
      profileImage,
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedUser)
    );

    setCurrentUser(updatedUser);
    setIsEditMode(false);

    alert("Profile updated successfully!");
  };

  // =========================================================
  // CANCEL PROFILE
  // =========================================================

  const handleCancelEdit = () => {
    setEditData({
      name: currentUser.name || "",
      email: currentUser.email || "",
      mobile: currentUser.mobile || "",
    });

    setIsEditMode(false);
  };

  // =========================================================
  // PASSWORD
  // =========================================================

  const handleChangePassword = () => {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    if (currentPassword !== currentUser.password) {
      alert("Current password is incorrect.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!passwordRegex.test(newPassword)) {
      alert(
        "Password must contain uppercase, lowercase and a number."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      alert("New password must be different.");
      return;
    }

    const updatedUser = {
      ...currentUser,
      password: newPassword,
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedUser)
    );

    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.map((user) =>
      user.email === currentUser.email
        ? { ...user, password: newPassword }
        : user
    );

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    setCurrentUser(updatedUser);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setActiveSetting(null);

    alert("Password changed successfully!");
  };

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const handleSaveNotifications = () => {
    const updatedUser = {
      ...currentUser,
      notifications,
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedUser)
    );

    setCurrentUser(updatedUser);

    alert("Notification settings saved!");
  };

  // =========================================================
  // EXPORT
  // =========================================================

  const handleExportReport = () => {
    const expenses = Number(spent || 0);
    const savingsAmount = Number(savings || 0);

    const savingsPercentage =
      income > 0
        ? ((savingsAmount / income) * 100).toFixed(2)
        : 0;

    const report = [
      ["BUDGET AI - FINANCIAL REPORT"],
      [],
      ["User", currentUser?.name || ""],
      ["Email", currentUser?.email || ""],
      ["Generated", new Date().toLocaleDateString()],
      [],
      ["FINANCIAL SUMMARY"],
      ["Total Income", income],
      ["Total Expenses", expenses],
      ["Total Savings", savingsAmount],
      ["Savings Percentage", `${savingsPercentage}%`],
    ];

    const csv = report
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `Budget-AI-Report-${new Date()
      .toISOString()
      .split("T")[0]}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setActiveSetting(null);

    alert("Financial report downloaded!");
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("currentUser");

    navigate("/login");
  };

  // =========================================================
  // DELETE ACCOUNT
  // =========================================================

  const handleDeleteAccount = () => {
    if (deleteConfirm !== "DELETE") {
      alert('Please type "DELETE" to continue.');
      return;
    }

    const confirmed = window.confirm(
      "This action permanently deletes your account. Continue?"
    );

    if (!confirmed) return;

    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.filter(
      (user) => user.email !== currentUser.email
    );

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    localStorage.removeItem("currentUser");
    localStorage.removeItem("budgetData");
    localStorage.removeItem("notifications");

    navigate("/register");
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeModal = () => {
    setActiveSetting(null);

    setDeleteConfirm("");

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // =========================================================
  // PROFILE COMPLETION
  // =========================================================

  const profileFields = [
    currentUser?.name,
    currentUser?.email,
    currentUser?.mobile,
    profileImage,
  ];

  const completedFields = profileFields.filter(Boolean).length;

  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100
  );

  // =========================================================
  // SAVINGS PERCENTAGE
  // =========================================================

  const totalIncome = Number(income || 0);
  const expenseAmount = Number(spent || 0);
  const savingsAmount = Number(savings || 0);

  const savingsPercentage =
    totalIncome > 0
      ? Math.max(
          0,
          Math.min(100, (savingsAmount / totalIncome) * 100)
        )
      : 0;

  // =========================================================
  // DEFAULT AVATAR
  // =========================================================

  const DefaultAvatar = () => {
    const letter =
      currentUser?.name?.charAt(0)?.toUpperCase() || "U";

    return (
      <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-2xl border-4 border-white">
        <span className="text-6xl font-bold">
          {letter}
        </span>
      </div>
    );
  };

  // =========================================================
  // TOGGLE
  // =========================================================

  const Toggle = ({ enabled, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-7 w-12 rounded-full transition-all ${
        enabled ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  );

  // =========================================================
  // SETTING CARD
  // =========================================================

  const SettingCard = ({
    icon,
    title,
    description,
    onClick,
    danger = false,
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full text-left p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        danger
          ? "border-red-200 hover:bg-red-50 hover:border-red-300"
          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
      }`}
    >
      <div className="flex items-center gap-4">

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${
            danger
              ? "bg-red-100"
              : "bg-blue-100"
          }`}
        >
          {icon}
        </div>

        <div className="flex-1">

          <h3
            className={`font-bold ${
              danger
                ? "text-red-600"
                : "text-gray-800"
            }`}
          >
            {title}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {description}
          </p>

        </div>

        <div className="text-gray-400 group-hover:text-blue-600 transition">
          →
        </div>

      </div>
    </button>
  );

  // =========================================================
  // NOT LOGGED IN
  // =========================================================

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">

        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">

          <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-5xl mb-6">
            👤
          </div>

          <h2 className="text-3xl font-bold text-gray-800">
            Welcome Back
          </h2>

          <p className="text-gray-500 mt-3 mb-7">
            Please log in to access your profile.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition"
          >
            Go to Login
          </button>

        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          TOP GRADIENT HEADER
      ===================================================== */}

      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700">

        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 relative">

          <p className="text-blue-100 text-sm font-medium">
            Account
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-white mt-1">
            My Profile
          </h1>

          <p className="text-blue-100 mt-2 max-w-xl">
            Manage your personal information, security,
            notifications and financial preferences.
          </p>

        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="max-w-6xl mx-auto px-5 md:px-8 -mt-8 relative pb-12">

        {/* ===================================================
            PROFILE MAIN CARD
        =================================================== */}

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">

          <div className="p-6 md:p-10">

            <div className="flex flex-col lg:flex-row gap-10">

              {/* PROFILE IMAGE */}

              <div className="flex flex-col items-center">

                <div className="relative">

                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover border-4 border-white shadow-2xl ring-4 ring-blue-100"
                    />
                  ) : (
                    <DefaultAvatar />
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition hover:scale-110"
                    title="Change profile photo"
                  >
                    📷
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                </div>

                <div className="flex gap-2 mt-5">

                  <button
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold transition"
                  >
                    Change Photo
                  </button>

                  {profileImage && (
                    <button
                      onClick={handleRemoveImage}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition"
                    >
                      Remove
                    </button>
                  )}

                </div>

                <p className="text-xs text-gray-400 mt-3">
                  JPG, PNG or WEBP · Max 2MB
                </p>

              </div>

              {/* USER INFORMATION */}

              <div className="flex-1">

                {!isEditMode ? (

                  <>

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                      <div>

                        <div className="flex items-center gap-3 flex-wrap">

                          <h2 className="text-3xl font-bold text-gray-900">
                            {currentUser.name || "User"}
                          </h2>

                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            ✓ Active
                          </span>

                        </div>

                        <p className="text-gray-500 mt-2">
                          {currentUser.email}
                        </p>

                        {currentUser.mobile && (
                          <p className="text-gray-500 mt-1">
                            📱 {currentUser.mobile}
                          </p>
                        )}

                      </div>

                      <button
                        onClick={() => setIsEditMode(true)}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition hover:shadow-lg"
                      >
                        ✏️ Edit Profile
                      </button>

                    </div>

                    {/* PROFILE COMPLETION */}

                    <div className="mt-8 p-5 bg-slate-50 rounded-2xl">

                      <div className="flex justify-between items-center mb-3">

                        <div>
                          <p className="font-bold text-gray-800">
                            Profile Completion
                          </p>

                          <p className="text-sm text-gray-500">
                            Complete your profile for a better experience
                          </p>
                        </div>

                        <span className="font-bold text-blue-600">
                          {profileCompletion}%
                        </span>

                      </div>

                      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">

                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all"
                          style={{
                            width: `${profileCompletion}%`,
                          }}
                        />

                      </div>

                    </div>

                  </>

                ) : (

                  /* EDIT MODE */

                  <div>

                    <div className="flex justify-between items-center mb-6">

                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          Edit Profile
                        </h2>

                        <p className="text-gray-500 text-sm mt-1">
                          Update your personal information
                        </p>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name
                        </label>

                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                          placeholder="Enter your name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Mobile Number
                        </label>

                        <input
                          type="tel"
                          value={editData.mobile}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              mobile: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                          placeholder="Enter mobile number"
                        />
                      </div>

                      <div className="md:col-span-2">

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>

                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                          placeholder="Enter email address"
                        />

                      </div>

                    </div>

                    <div className="flex gap-3 mt-6">

                      <button
                        onClick={handleSaveProfile}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold transition"
                      >
                        ✓ Save Changes
                      </button>

                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-7 py-3 rounded-xl font-semibold transition"
                      >
                        Cancel
                      </button>

                    </div>

                  </div>
                )}

              </div>

            </div>
          </div>
        </div>

        {/* ===================================================
            FINANCIAL OVERVIEW
        =================================================== */}

        <div className="mb-8">

          <div className="mb-5">

            <h2 className="text-2xl font-bold text-gray-800">
              Financial Overview
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Your current financial performance
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* INCOME */}

            <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">

              <div className="flex items-center justify-between">

                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
                  💰
                </div>

                <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  INCOME
                </span>

              </div>

              <p className="text-gray-500 text-sm mt-5">
                Total Income
              </p>

              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                ₹{income.toLocaleString()}
              </h3>

            </div>

            {/* EXPENSE */}

            <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">

              <div className="flex items-center justify-between">

                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-2xl">
                  💳
                </div>

                <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  EXPENSES
                </span>

              </div>

              <p className="text-gray-500 text-sm mt-5">
                Total Expenses
              </p>

              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                ₹{expenseAmount.toLocaleString()}
              </h3>

            </div>

            {/* SAVINGS */}

            <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">

              <div className="flex items-center justify-between">

                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                  📈
                </div>

                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  SAVINGS
                </span>

              </div>

              <p className="text-gray-500 text-sm mt-5">
                Total Savings
              </p>

              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                ₹{savingsAmount.toLocaleString()}
              </h3>

              <p className="text-sm text-blue-600 font-semibold mt-2">
                {savingsPercentage.toFixed(1)}% of income
              </p>

            </div>

          </div>
        </div>

        {/* ===================================================
            ACCOUNT SETTINGS
        =================================================== */}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 md:p-8">

          <div className="mb-7">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl">
                ⚙️
              </div>

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Account Settings
                </h2>

                <p className="text-gray-500 text-sm">
                  Manage your account preferences and security
                </p>

              </div>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <SettingCard
              icon="🔐"
              title="Change Password"
              description="Update your password and keep your account secure"
              onClick={() =>
                setActiveSetting("password")
              }
            />

            <SettingCard
              icon="🔔"
              title="Notification Settings"
              description="Manage budget, expense and email notifications"
              onClick={() =>
                setActiveSetting("notifications")
              }
            />

            <SettingCard
              icon="📊"
              title="Export Financial Report"
              description="Download your financial information as a CSV file"
              onClick={() =>
                setActiveSetting("export")
              }
            />

            <SettingCard
              icon="🚪"
              title="Logout"
              description="Sign out securely from your Budget AI account"
              onClick={handleLogout}
            />

          </div>

          {/* DANGER ZONE */}

          <div className="mt-8 pt-8 border-t border-gray-200">

            <div className="mb-4">

              <h3 className="text-lg font-bold text-red-600">
                Danger Zone
              </h3>

              <p className="text-sm text-gray-500">
                Permanent account actions
              </p>

            </div>

            <SettingCard
              icon="🗑️"
              title="Delete Account"
              description="Permanently remove your account and locally stored data"
              danger
              onClick={() =>
                setActiveSetting("delete")
              }
            />

          </div>

        </div>

      </div>

      {/* =====================================================
          MODALS
      ===================================================== */}

      {activeSetting && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* =================================================
                PASSWORD
            ================================================= */}

            {activeSetting === "password" && (
              <div className="p-6 md:p-8">

                <div className="flex items-start justify-between mb-7">

                  <div>

                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                      🔐
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800">
                      Change Password
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                      Protect your account with a strong password.
                    </p>

                  </div>

                  <button
                    onClick={closeModal}
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xl"
                  >
                    ×
                  </button>

                </div>

                <div className="space-y-5">

                  {/* CURRENT */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Password
                    </label>

                    <div className="relative">

                      <input
                        type={
                          showCurrentPassword
                            ? "text"
                            : "password"
                        }
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(
                            !showCurrentPassword
                          )
                        }
                        className="absolute right-3 top-3"
                      >
                        {showCurrentPassword
                          ? "🙈"
                          : "👁️"}
                      </button>

                    </div>

                  </div>

                  {/* NEW */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>

                    <div className="relative">

                      <input
                        type={
                          showNewPassword
                            ? "text"
                            : "password"
                        }
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(
                            !showNewPassword
                          )
                        }
                        className="absolute right-3 top-3"
                      >
                        {showNewPassword
                          ? "🙈"
                          : "👁️"}
                      </button>

                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      At least 6 characters with uppercase,
                      lowercase and a number.
                    </p>

                  </div>

                  {/* CONFIRM */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm New Password
                    </label>

                    <div className="relative">

                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword:
                              e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        className="absolute right-3 top-3"
                      >
                        {showConfirmPassword
                          ? "🙈"
                          : "👁️"}
                      </button>

                    </div>

                  </div>

                  <div className="flex gap-3 pt-2">

                    <button
                      onClick={handleChangePassword}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition"
                    >
                      Update Password
                    </button>

                    <button
                      onClick={closeModal}
                      className="px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold"
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              </div>
            )}

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            {activeSetting === "notifications" && (
              <div className="p-6 md:p-8">

                <div className="flex justify-between mb-7">

                  <div>

                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                      🔔
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800">
                      Notifications
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                      Customize your notification preferences.
                    </p>

                  </div>

                  <button
                    onClick={closeModal}
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    ×
                  </button>

                </div>

                <div className="space-y-3">

                  {[
                    [
                      "emailNotifications",
                      "Email Notifications",
                      "Receive important account emails.",
                    ],
                    [
                      "budgetAlerts",
                      "Budget Alerts",
                      "Get notified when you approach your budget.",
                    ],
                    [
                      "expenseAlerts",
                      "Expense Alerts",
                      "Receive alerts about your spending.",
                    ],
                    [
                      "monthlyReport",
                      "Monthly Report",
                      "Receive a monthly financial summary.",
                    ],
                  ].map(([key, title, description]) => (

                    <div
                      key={key}
                      className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 rounded-xl transition"
                    >

                      <div>

                        <h3 className="font-bold text-gray-800">
                          {title}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          {description}
                        </p>

                      </div>

                      <Toggle
                        enabled={notifications[key]}
                        onChange={() =>
                          setNotifications({
                            ...notifications,
                            [key]: !notifications[key],
                          })
                        }
                      />

                    </div>

                  ))}

                </div>

                <div className="flex gap-3 mt-6">

                  <button
                    onClick={handleSaveNotifications}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold"
                  >
                    Save Settings
                  </button>

                  <button
                    onClick={closeModal}
                    className="px-5 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>

                </div>

              </div>
            )}

            {/* =================================================
                EXPORT
            ================================================= */}

            {activeSetting === "export" && (
              <div className="p-6 md:p-8">

                <div className="flex justify-between mb-7">

                  <div>

                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                      📊
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800">
                      Financial Report
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                      Download your financial summary.
                    </p>

                  </div>

                  <button
                    onClick={closeModal}
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    ×
                  </button>

                </div>

                <div className="bg-slate-50 rounded-2xl p-5 space-y-4">

                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      Income
                    </span>

                    <strong>
                      ₹{income.toLocaleString()}
                    </strong>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      Expenses
                    </span>

                    <strong>
                      ₹{expenseAmount.toLocaleString()}
                    </strong>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      Savings
                    </span>

                    <strong className="text-blue-600">
                      ₹{savingsAmount.toLocaleString()}
                    </strong>

                  </div>

                  <div className="border-t pt-4 flex justify-between">

                    <span className="font-semibold">
                      Savings Rate
                    </span>

                    <strong className="text-blue-600">
                      {savingsPercentage.toFixed(1)}%
                    </strong>

                  </div>

                </div>

                <button
                  onClick={handleExportReport}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition"
                >
                  📥 Download Financial Report
                </button>

              </div>
            )}

            {/* =================================================
                DELETE
            ================================================= */}

            {activeSetting === "delete" && (
              <div className="p-6 md:p-8">

                <div className="flex justify-between mb-7">

                  <div>

                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                      ⚠️
                    </div>

                    <h2 className="text-2xl font-bold text-red-600">
                      Delete Account
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                      This action cannot be undone.
                    </p>

                  </div>

                  <button
                    onClick={closeModal}
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    ×
                  </button>

                </div>

                <div className="bg-red-50 border border-red-200 rounded-2xl p-5">

                  <p className="text-sm text-red-700 leading-6">
                    Deleting your account will remove your
                    local account information and stored
                    application data.
                  </p>

                </div>

                <div className="mt-5">

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type DELETE to confirm
                  </label>

                  <input
                    type="text"
                    value={deleteConfirm}
                    onChange={(e) =>
                      setDeleteConfirm(e.target.value)
                    }
                    placeholder="DELETE"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none"
                  />

                </div>

                <div className="flex gap-3 mt-6">

                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold"
                  >
                    Permanently Delete
                  </button>

                  <button
                    onClick={closeModal}
                    className="px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>

                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;