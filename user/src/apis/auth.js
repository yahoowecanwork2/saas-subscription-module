import { api } from "./index";

export const authApi = {
  // ---------------- Auth ----------------

  register: async (data) => {
    const res = await api.post("/user/register", data);
    return res.data;
  },

  resendOtp: async (data) => {
    const res = await api.post("/user/resend-otp", data);
    return res.data;
  },

  verifyUser: async (data) => {
    const res = await api.post("/user/verify", data);
    return res.data;
  },

  login: async (data) => {
    const res = await api.post("/user/login", data);
    return res.data;
  },

  forgotPassword: async (data) => {
    const res = await api.post("/user/forgotpassword", data);
    return res.data;
  },

  resetPassword: async (data) => {
    const res = await api.post("/user/resetpassword", data);
    return res.data;
  },

  logout: async () => {
    const res = await api.post("/user/logout");
    localStorage.removeItem("token");
    return res.data;
  },

  checkAuth: async () => {
    const res = await api.get("/user/check-auth");
    return res.data;
  },
  getHeaderDetail: async () => {
    const res = await api.get("/user/header-detail");
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put("/user/update", data);
    return res.data;
  },
};
