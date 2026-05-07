import React, { useState } from "react";
import { MdOutlineMail, MdOutlineLock, MdOutlinePerson } from "react-icons/md";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import toast from "react-hot-toast";
import Registerotpverify from "./modal/Registerotpverify";
import { authApi } from "../../apis/auth";

import { clearToken, setToken } from "../../apis/utils/storage";
import {
  clearRegisterData,
  setAuth,
  setRegisterData,
} from "../../redux/userSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [showmodal, setShowmodal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setAuth(false));
    dispatch(setRegisterData(formData));
    clearToken();

    try {
      setLoading(true);
      const res = await authApi.register(formData);

      if (res.success) {
        toast.success(res?.message);
        setToken(res?.token);
        setLoading(false);
        setShowmodal(true);
      }
    } catch (error) {
      setLoading(false);
      clearToken();
      dispatch(clearRegisterData());
      dispatch(setAuth(false));
      toast.error(error?.response?.data?.message || "Server Error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans p-4">
      <div className="flex w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[85vh]">
        {/* LEFT SIDE: SaaS Value Proposition */}
        <div className="hidden lg:flex w-1/2 bg-indigo-700 flex-col justify-center px-16 text-white relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600 rounded-full opacity-50"></div>

          <div className="relative z-10">
            <h1 className="text-5xl font-black mb-6 tracking-tight">
              Start your <br />
              <span className="text-indigo-300 font-medium">
                Growth Journey.
              </span>
            </h1>

            <p className="text-indigo-100 text-lg mb-10 max-w-sm leading-relaxed">
              Join thousands of businesses managing their subscriptions and
              workflows efficiently with our all-in-one SaaS platform.
            </p>

            <div className="space-y-6">
              {[
                {
                  title: "Smart Billing",
                  desc: "Automated subscription management",
                },
                {
                  title: "Team Collaboration",
                  desc: "Invite & manage your entire workspace",
                },
                {
                  title: "Data Insights",
                  desc: "Detailed analytics at your fingertips",
                },
                {
                  title: "Enterprise Security",
                  desc: "256-bit encryption for your data",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1 h-5 w-5 rounded-full bg-indigo-400 flex items-center justify-center text-[10px]">
                    ✔
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{item.title}</h3>
                    <p className="text-indigo-200 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Register Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Create Account
              </h2>
              <p className="text-gray-500 mt-2">
                Get started with your 14-day free trial
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* NAME */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">
                  Full Name
                </label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus-within:border-indigo-500 focus-within:bg-white transition-all shadow-sm">
                  <MdOutlinePerson className="text-gray-400 text-xl" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full outline-none ml-3 bg-transparent text-gray-700 font-medium"
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">
                  Work Email
                </label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus-within:border-indigo-500 focus-within:bg-white transition-all shadow-sm">
                  <MdOutlineMail className="text-gray-400 text-xl" />
                  <input
                    type="email"
                    placeholder="john@company.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full outline-none ml-3 bg-transparent text-gray-700 font-medium"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">
                  Password
                </label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus-within:border-indigo-500 focus-within:bg-white transition-all shadow-sm">
                  <MdOutlineLock className="text-gray-400 text-xl" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full outline-none ml-3 bg-transparent text-gray-700 font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-indigo-600 transition"
                  >
                    {showPassword ? (
                      <IoEyeOffOutline size={20} />
                    ) : (
                      <IoEyeOutline size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-70 mt-4 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Create Workspace"
                )}
              </button>

              {/* LOGIN LINK */}
              <div className="pt-6 border-t border-gray-100 mt-4">
                <p className="text-center text-sm text-gray-500">
                  Already have an account?
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-indigo-600 ml-2 font-bold hover:underline"
                  >
                    Log in here
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showmodal && <Registerotpverify setShowmodal={setShowmodal} />}
    </div>
  );
};

export default Register;
