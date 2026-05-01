import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

// Icons
import { MdOutlineMail, MdOutlineLock } from "react-icons/md";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

// Logic & Components
import { adminApi } from "../../apis/auth";
import { clearToken, setToken } from "../../apis/storage";
import { setLoginData } from "../../redux/userSlice";
import Forgotpassword from "./modal/Forgotpassword";
import Loginotpverify from "./modal/Loginotpverifymodal";

// import logo from "../../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [showmodal, setShowmodal] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoginData(formData));
    clearToken();
    try {
      setLoading(true);
      const res = await adminApi.login(formData);
      if (res.success) {
        toast.success(res?.message);
        setToken(res?.token);
        setLoading(false);
        setShowmodal(true);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="flex w-full max-w-4xl bg-white rounded-sm shadow-2xl overflow-hidden border border-gray-200">
        {/* LEFT SIDE: THEME PANEL */}
        <div className="hidden md:flex w-1/2 bg-gray-900 p-12 flex-col justify-between text-white relative">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

          <div className="relative z-10">
            {/* <img src={logo} alt="Logo" className="w-28 mb-1" /> */}
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Digital Solutions
            </p>
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4">
              Ecommerce <br /> Admin Panel
            </h1>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              Secure access to your store's inventory, orders, and customer
              analytics.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-gray-800">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
              System Status: <span className="text-green-500">Active</span>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: LOGIN FORM */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
              Login
            </h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              Enter your credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Email Address
              </label>
              <div className="flex items-center w-full h-12 bg-gray-50 border border-gray-200 px-4 rounded-sm focus-within:border-gray-900 transition-all group">
                <MdOutlineMail
                  className="text-gray-400 group-focus-within:text-gray-900 transition-colors"
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

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotPassword(true)}
                  className="text-[10px] font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-tighter"
                >
                  Forgot?
                </button>
              </div>
              <div className="flex items-center w-full h-12 bg-gray-50 border border-gray-200 px-4 rounded-sm focus-within:border-gray-900 transition-all group">
                <MdOutlineLock
                  className="text-gray-400 group-focus-within:text-gray-900 transition-colors"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white h-12 mt-4 text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-black transition-all shadow-lg active:scale-[0.98] disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Login to Dashboard"}
            </button>

            <p className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-6">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-gray-900 border-b-2 border-gray-900 pb-0.5 hover:text-gray-600 hover:border-gray-400 transition-all ml-1"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* MODALS */}
      {forgotPassword && (
        <Forgotpassword setForgotPassword={setForgotPassword} />
      )}
      {showmodal && <Loginotpverify setShowmodal={setShowmodal} />}
    </div>
  );
};

export default Login;
