import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MdClose, MdSecurity } from "react-icons/md";
import { clearLoginData, setAuth, setUser } from "../../../redux/userSlice";
import { clearToken, getToken, setToken } from "../../../apis/storage";
import { adminApi } from "../../../apis/auth";

const Loginotpverify = ({ setShowmodal }) => {
  const [timer, setTimer] = useState(30);
  const [userLoading, setUserLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setresendLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginData = useSelector((state) => state.user.loginData);

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e, i) => {
    const value = e.target.value.replace(/\D/, "");
    if (!value) return;
    const newOtp = [...otp];
    newOtp[i] = value;
    setOtp(newOtp);
    if (i < otp.length - 1 && value) {
      inputsRef.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (!otp[i] && i > 0) {
        newOtp[i - 1] = "";
        setOtp(newOtp);
        inputsRef.current[i - 1]?.focus();
      } else {
        newOtp[i] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];
    pastedData.forEach((digit, idx) => (newOtp[idx] = digit));
    setOtp(newOtp);
    const lastIndex = Math.min(pastedData.length, 5);
    inputsRef.current[lastIndex]?.focus();
  };

  const getProfile = async () => {
    try {
      setUserLoading(true);
      const res = await adminApi.profile();
      if (res?.success) {
        dispatch(setUser(res.user));
        dispatch(setAuth(true));
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("Profile sync failed");
    } finally {
      setUserLoading(false);
    }
  };

  const handleVerification = async (enteredOtp) => {
    const token = getToken();
    try {
      setLoading(true);
      const res = await adminApi.loginOtpVerify({
        otp: enteredOtp,
        activationToken: token,
      });
      if (res?.success) {
        setToken(res.token);
        toast.success(res?.message || "Identity Verified");
        dispatch(clearLoginData());
        setShowmodal(false);
        setTimeout(() => getProfile(), 500);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      return toast.error("Enter complete 6-digit code");
    }
    handleVerification(enteredOtp);
  };

  const resendOtp = async () => {
    if (!canResend) return;
    try {
      setresendLoading(true);
      clearToken();
      const res = await adminApi.resendOtp({
        email: loginData.email,
        password: loginData.password,
      });
      if (res.success) {
        setToken(res?.token);
        setTimer(30);
        setCanResend(false);
        toast.success("New code transmitted");
      }
    } catch (error) {
      toast.error("Resend failed. Please login again.");
      navigate("/");
    } finally {
      setresendLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-[60] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">
          Initializing Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden border border-gray-100 relative">
        {/* TOP ACCENT BAR */}
        <div className="h-1 bg-gray-900 w-full"></div>

        {/* CLOSE BUTTON */}
        <button
          onClick={() => setShowmodal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <MdClose size={20} />
        </button>

        <div className="p-8 md:p-10">
          {/* HEADER */}
          <div className="mb-8 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <MdSecurity className="text-gray-900" size={20} />
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                2FA Verify
              </h2>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
              Multi-factor authentication required
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <p className="text-xs font-medium text-gray-500 text-center md:text-left leading-relaxed">
              Transmit the 6-digit verification code sent to your registered
              contact point.
            </p>

            {/* OTP INPUTS */}
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-10 h-14 md:w-12 md:h-14 text-center text-lg font-black bg-gray-50 border border-gray-200 text-gray-900 rounded-sm focus:border-gray-900 focus:bg-white focus:outline-none transition-all"
                />
              ))}
            </div>

            {/* SUBMIT */}
            <div className="space-y-4 pt-2">
              <button
                type="submit"
                disabled={loading || resendLoading}
                className="w-full bg-gray-900 text-white h-12 text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-black transition-all shadow-lg active:scale-[0.98] disabled:bg-gray-400"
              >
                {loading ? "Verifying Access..." : "Finalize Authentication"}
              </button>

              <div className="flex items-center justify-between px-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Transmission Status
                </p>
                {canResend ? (
                  <button
                    type="button"
                    onClick={resendOtp}
                    className="text-[10px] font-black text-gray-900 uppercase tracking-widest border-b border-gray-900 hover:text-gray-600 hover:border-gray-400 transition-all"
                  >
                    Resend Code
                  </button>
                ) : (
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Wait {timer}s
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 py-3 border-t border-gray-100 text-center">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
            Identity Protocol v3.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loginotpverify;
