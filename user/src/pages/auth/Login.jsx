import React, { useState } from "react";
import { MdOutlineMail, MdOutlineLock } from "react-icons/md";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Forgotpassword from "./modal/Forgotpassword";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

import { authApi } from "../../apis/auth";
import { setToken } from "../../apis/utils/storage";
import { setAuth, setUser } from "../../redux/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const loadProfile = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await authApi.getHeaderDetail();
  //     console.log(res);

  //     if (res.success) {
  //       toast.success(res?.message);
  //       dispatch(setAuth(res.success));
  //       dispatch(setUser(res.user));
  //       setLoading(false);
  //       navigate("/plans");
  //     }
  //   } catch (error) {
  //     console.log(error);

  //     dispatch(setUser(null));
  //     dispatch(setAuth(false));
  //     setLoading(false);
  //   }
  // };

  const loadProfile = async () => {
    try {
      setLoading(true);

      const res = await authApi.getHeaderDetail();

      console.log(res);

      if (res.success) {
        toast.success(res?.message);

        dispatch(setAuth(res.success));

        dispatch(setUser(res.user));

        // ✅ CHECK SUBSCRIPTION
        const subscription = res?.user?.subscription;

        const isActive =
          subscription &&
          subscription?.status === "active" &&
          subscription?.endDate &&
          new Date(subscription?.endDate) > new Date();

        // ✅ REDIRECT
        if (isActive) {
          navigate("/home");
        } else {
          navigate("/plans");
        }
      }
    } catch (error) {
      console.log(error);

      dispatch(setUser(null));

      dispatch(setAuth(false));
    } finally {
      setLoading(false);
    }
  };
  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   try {
  //     setLoading(true);
  //     const res = await authApi.login(formData);
  //     console.log(res);

  //     if (res.success) {
  //       toast.success(res.message);
  //       setToken(res?.token);
  //       setLoading(false);
  //       console.log("up");

  //       loadProfile();
  //       console.log("down");
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     toast.error(error?.response?.data?.message || "Server Error Occurred");
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await authApi.login(formData);

      console.log(res);

      if (res.success) {
        toast.success(res.message);

        setToken(res?.token);

        await loadProfile();
      }
    } catch (error) {
      setLoading(false);

      toast.error(error?.response?.data?.message || "Server Error Occurred");
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
      <div className="flex w-full max-w-6xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden m-4">
        {/* LEFT SIDE: Brand & Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex w-1/2 bg-indigo-600 flex-col justify-center px-16 text-white"
        >
          <div className="mb-8">
            <span className="bg-indigo-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              SaaS Platform
            </span>
          </div>
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            Manage your subscriptions <br /> in one place.
          </h1>

          <p className="text-indigo-100 text-lg mb-8">
            Get access to premium features, real-time analytics, and dedicated
            support for your business growth.
          </p>

          <ul className="space-y-4 text-sm font-medium">
            <li className="flex items-center gap-3">
              <span className="bg-indigo-500 p-1 rounded-full text-xs">✔</span>
              Flexible Monthly & Yearly Plans
            </li>
            <li className="flex items-center gap-3">
              <span className="bg-indigo-500 p-1 rounded-full text-xs">✔</span>
              Advanced Dashboard & Analytics
            </li>
            <li className="flex items-center gap-3">
              <span className="bg-indigo-500 p-1 rounded-full text-xs">✔</span>
              Priority Customer Support
            </li>
            <li className="flex items-center gap-3">
              <span className="bg-indigo-500 p-1 rounded-full text-xs">✔</span>
              Unlimited Team Collaboration
            </li>
          </ul>
        </motion.div>

        {/* RIGHT SIDE: Login Form */}
        <div className="w-full md:w-1/2 flex justify-center items-center px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-500 mt-2">
                Please enter your details to sign in
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <MdOutlineMail className="absolute left-3 top-3.5 text-gray-400 text-xl" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    autoComplete="email"
                    required
                    className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <span
                    onClick={() => setForgotPassword(true)}
                    className="text-xs font-bold text-indigo-600 cursor-pointer hover:underline"
                  >
                    Forgot Password?
                  </span>
                </div>
                <div className="relative">
                  <MdOutlineLock className="absolute left-3 top-3.5 text-gray-400 text-xl" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full h-12 pl-11 pr-12 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 cursor-pointer text-gray-400 hover:text-indigo-500 transition-colors"
                  >
                    {showPassword ? (
                      <IoEyeOffOutline size={20} />
                    ) : (
                      <IoEyeOutline size={20} />
                    )}
                  </div>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* SIGNUP */}
              <p className="text-center text-sm text-gray-600 mt-8">
                New to the platform?
                <span
                  onClick={() => navigate("/register")}
                  className="text-indigo-600 cursor-pointer ml-1 font-bold hover:underline"
                >
                  Create an account
                </span>
              </p>
            </form>
          </motion.div>
        </div>
      </div>

      {forgotPassword && (
        <Forgotpassword setForgotPassword={setForgotPassword} />
      )}
    </div>
  );
};

export default Login;
