import React, { useState } from "react";
import { IoMailOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import { adminApi } from "../../../apis/auth";

const Forgotpassword = ({ setForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter a valid email identifier");

    setLoading(true);
    try {
      const res = await adminApi.forgotPassword({ email });
      if (res.success) {
        toast.success("Recovery link dispatched to your email");
        setForgotPassword(false);
      } else {
        toast.error(res.message || "Recovery attempt failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal System Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden border border-gray-100 relative">
        {/* TOP ACCENT BAR */}
        <div className="h-1 bg-gray-900 w-full"></div>

        {/* CLOSE BUTTON */}
        <button
          onClick={() => setForgotPassword(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors p-1"
        >
          <MdClose size={20} />
        </button>

        <div className="p-8 md:p-10">
          {/* HEADER */}
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
              Recovery
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 leading-relaxed">
              Initiate credential reset protocol
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-xs font-medium text-gray-500 leading-relaxed">
              Enter your registered identifier below. We will transmit a secure
              one-time link to restore your administrative access.
            </p>

            {/* EMAIL INPUT */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Email Identifier
              </label>
              <div className="flex items-center w-full h-12 bg-gray-50 border border-gray-200 px-4 rounded-sm focus-within:border-gray-900 transition-all group">
                <IoMailOutline
                  className="text-gray-400 group-focus-within:text-gray-900"
                  size={20}
                />
                <input
                  type="email"
                  placeholder="admin@arcoders.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-full ml-3 bg-transparent outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-normal"
                  required
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white h-12 text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-black transition-all shadow-lg active:scale-[0.98] disabled:bg-gray-400"
              >
                {loading ? "Transmitting..." : "Send Recovery Link"}
              </button>

              <button
                type="button"
                onClick={() => setForgotPassword(false)}
                className="w-full mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors text-center"
              >
                Back to Authentication
              </button>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 py-3 border-t border-gray-100 text-center">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
            Arcoders Digital Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forgotpassword;
