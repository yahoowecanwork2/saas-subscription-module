import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineLock } from "react-icons/md";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { authApi } from "../../apis/auth";

const Resetpassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

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

      const res = await authApi.resetPassword({ token, password });

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
    <div className="w-full min-h-screen flex justify-center items-center bg-blue-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-[420px] rounded-2xl p-8 shadow-lg border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-blue-700 mb-2">
          Reset Password
        </h1>

        <p className="text-sm text-gray-600 mb-6">
          Enter your new password below.
        </p>

        {/* NEW PASSWORD */}
        <label className="text-sm font-medium text-gray-700">
          New Password
        </label>

        <div className="flex items-center w-full h-11 mb-4 bg-white border border-gray-300 px-3 rounded-lg mt-1 focus-within:border-blue-500 transition">
          <MdOutlineLock className="h-5 w-5 text-blue-600" />

          <input
            type={showPass1 ? "text" : "password"}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-full ml-2 text-gray-700 outline-none"
          />

          {showPass1 ? (
            <IoEyeOffOutline
              onClick={() => setShowPass1(false)}
              className="h-6 w-6 text-blue-600 cursor-pointer"
            />
          ) : (
            <IoEyeOutline
              onClick={() => setShowPass1(true)}
              className="h-6 w-6 text-blue-600 cursor-pointer"
            />
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <label className="text-sm font-medium text-gray-700">
          Confirm Password
        </label>

        <div className="flex items-center w-full h-11 bg-white border border-gray-300 px-3 rounded-lg mt-1 focus-within:border-blue-500 transition">
          <MdOutlineLock className="h-5 w-5 text-blue-600" />

          <input
            type={showPass2 ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-full ml-2 text-gray-700 outline-none"
          />

          {showPass2 ? (
            <IoEyeOffOutline
              onClick={() => setShowPass2(false)}
              className="h-6 w-6 text-blue-600 cursor-pointer"
            />
          ) : (
            <IoEyeOutline
              onClick={() => setShowPass2(true)}
              className="h-6 w-6 text-blue-600 cursor-pointer"
            />
          )}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white h-11 w-full mt-6 text-lg font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default Resetpassword;
