import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

// Icons
import {
  MdOutlineMail,
  MdOutlineLock,
  MdOutlinePerson,
  MdPhone,
} from "react-icons/md";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

// Logic & Components -----------------------------------
import { clearToken, setToken } from "../../apis/storage";
import {
  clearRegisterData,
  setAuth,
  setRegisterData,
} from "../../redux/userSlice";
import { adminApi } from "../../apis/auth";
import Registerotpverify from "./modal/Registerotpverify";

// import logo from "../../assets/logo.png";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [showmodal, setShowmodal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneno: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setAuth(false));
    dispatch(setRegisterData(formData));
    clearToken();
    try {
      setLoading(true);
      const res = await adminApi.register(formData);
      if (res?.status === "success" || res?.success) {
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
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-sm shadow-2xl overflow-hidden border border-gray-200">
        {/* LEFT SIDE: BRANDING PANEL */}
        <div className="hidden md:flex w-5/12 bg-gray-900 p-12 flex-col justify-between text-white relative">
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

          <div className="relative z-10">
            {/* <img src={logo} alt="Logo" className="w-28 mb-1" /> */}
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Digital Solutions
            </p>
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4">
              Join the <br /> Ecosystem
            </h1>
            <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
              Create an administrative account to oversee inventory, fulfill
              orders, and monitor business growth.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-gray-800">
            <ul className="space-y-3">
              {[
                "Secure Enrollment",
                "Role-Based Access",
                "Inventory Management",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-widest"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>{" "}
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT SIDE: REGISTRATION FORM */}
        <div className="w-full md:w-7/12 p-8 md:p-12 overflow-y-auto max-h-[90vh] custom-scrollbar">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
              Create Account
            </h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              Enroll as a new administrator
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* NAME */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Full Name
              </label>
              <div className="flex items-center w-full h-12 bg-gray-50 border border-gray-200 px-4 rounded-sm focus-within:border-gray-900 transition-all group">
                <MdOutlinePerson
                  className="text-gray-400 group-focus-within:text-gray-900"
                  size={20}
                />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="flex-1 h-full ml-3 bg-transparent outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-normal"
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Email Address
              </label>
              <div className="flex items-center w-full h-12 bg-gray-50 border border-gray-200 px-4 rounded-sm focus-within:border-gray-900 transition-all group">
                <MdOutlineMail
                  className="text-gray-400 group-focus-within:text-gray-900 shrink-0"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="flex-1 h-full ml-3 bg-transparent outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-normal"
                  required
                />
              </div>
            </div>

            {/* PHONE */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Phone Number
              </label>
              <div className="flex items-center w-full h-12 bg-gray-50 border border-gray-200 px-4 rounded-sm focus-within:border-gray-900 transition-all group">
                <MdPhone
                  className="text-gray-400 group-focus-within:text-gray-900 shrink-0"
                  size={18}
                />
                <input
                  type="text"
                  name="phoneno"
                  placeholder="+91 00000 00000"
                  value={formData.phoneno}
                  onChange={handleChange}
                  className="flex-1 h-full ml-3 bg-transparent outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-normal"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Password
              </label>
              <div className="flex items-center w-full h-12 bg-gray-50 border border-gray-200 px-4 rounded-sm focus-within:border-gray-900 transition-all group">
                <MdOutlineLock
                  className="text-gray-400 group-focus-within:text-gray-900"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="flex-1 h-full ml-3 bg-transparent outline-none text-sm font-bold text-gray-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-900"
                >
                  {showPassword ? (
                    <IoEyeOffOutline size={18} />
                  ) : (
                    <IoEyeOutline size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white h-12 text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-black transition-all shadow-lg active:scale-[0.98] disabled:bg-gray-400"
              >
                {loading ? "Registering System..." : "Confirm Enrollment"}
              </button>

              <p className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-6">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="text-gray-900 border-b-2 border-gray-900 pb-0.5 hover:text-gray-600 hover:border-gray-400 transition-all ml-1"
                >
                  Return to Login
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {showmodal && <Registerotpverify setShowmodal={setShowmodal} />}
    </div>
  );
};

export default Register;
