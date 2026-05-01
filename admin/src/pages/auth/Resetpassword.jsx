import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineLock } from "react-icons/md";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { adminApi } from "../../apis/auth";

const Resetpassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  console.log(token);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword)
      return toast.error("Please enter both password fields.");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match!");
    try {
      setLoading(true);
      const res = await adminApi.resetPassword({ token, password });
      console.log(res);
      if (res.success) {
        toast.success(res.message || "Password reset successful!");
        navigate("/");
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
    <div className="w-full h-screen flex justify-center items-center bg-[#F3F4F6] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-[400px] rounded-xl p-8 shadow-xl"
      >
        <h1 className="text-2xl font-semibold mb-4">Reset Password</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter your new password below.
        </p>

        {/* Password */}
        <label className="text-sm font-medium">New Password</label>
        <div className="flex items-center w-full h-10 mb-4 bg-[#F5F5F5] border px-2 rounded-sm mt-1 text-[#5E5E5E]">
          <MdOutlineLock className="h-6 w-6 text-black" />
          <input
            type={showPass1 ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-full ml-2 text-[#5E5E5E] outline-none"
          />

          {showPass1 ? (
            <IoEyeOffOutline
              onClick={() => setShowPass1(false)}
              className="h-10 w-6 text-black cursor-pointer"
            />
          ) : (
            <IoEyeOutline
              onClick={() => setShowPass1(true)}
              className="h-10 w-6 text-black cursor-pointer"
            />
          )}
        </div>

        {/* Confirm Password */}
        <label className="text-sm font-medium">Confirm Password</label>
        <div className="flex items-center w-full h-10 bg-[#F5F5F5] border px-2 rounded-sm mt-1 text-[#5E5E5E]">
          <MdOutlineLock className="h-6 w-6 text-black" />
          <input
            type={showPass2 ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-full ml-2 text-[#5E5E5E] outline-none"
          />

          {showPass2 ? (
            <IoEyeOffOutline
              onClick={() => setShowPass2(false)}
              className="h-10 w-6 text-black cursor-pointer"
            />
          ) : (
            <IoEyeOutline
              onClick={() => setShowPass2(true)}
              className="h-10 w-6 text-black cursor-pointer"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#3A00E6] text-white h-10 w-full mt-6 text-lg rounded-md hover:bg-[#2a00b4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default Resetpassword;
