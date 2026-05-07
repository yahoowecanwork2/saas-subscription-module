import React from "react";
import { IoMailOutline } from "react-icons/io5";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../../../apis/auth";

const Forgotpassword = ({ setForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log(email);

    e.preventDefault();
    if (!email) return alert("Please enter a valid email");

    setLoading(true);
    try {
      const res = await authApi.forgotPassword({ email });
      console.log(res);
      if (res.success) {
        toast.success("Reset link sent to your email!");
        setForgotPassword(false);
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server Error Occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-[90%] max-w-md rounded-xl shadow-lg p-6 relative">
          {/* Close Button */}
          <button
            onClick={() => setForgotPassword(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-[400px] rounded-xl p-8 shadow-xl"
          >
            <h1 className="text-2xl font-semibold mb-4">Forget Password</h1>
            <p className="text-sm text-gray-600 mb-6">
              Enter your registered email. We’ll send you a password reset link.
            </p>

            {/* Email Input */}
            <label className="text-sm font-medium">Email</label>
            <div className="flex items-center w-full h-10 mb-4 bg-[#F5F5F5] border px-2 rounded-sm mt-1 text-[#5E5E5E]">
              <IoMailOutline className="h-6 w-6 text-black" />
              <input
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-full ml-2 text-[#5E5E5E] outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#3A00E6] text-white h-10 w-full mt-4 text-lg rounded-md hover:bg-[#2a00b4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Forgotpassword;
