// auth

import { api } from "./index";

export const adminApi = {
  register: async (data) => {
    const res = await api.post("/admin/register", data);
    return res.data;
  },

  registerOtpResend: async (data) => {
    const res = await api.post("/admin/register-resend-otp", data);
    return res.data;
  },

  registerOtpVerify: async (data) => {
    const res = await api.post("/admin/register-otp-verify", data);
    return res.data;
  },

  login: async (data) => {
    const res = await api.post("/admin/login", data);
    return res.data;
  },

  loginOtpResend: async (data) => {
    const res = await api.post("/admin/login-otp-resend", data);
    return res.data;
  },

  loginOtpVerify: async (data) => {
    const res = await api.post("/admin/login-otp-verify", data);
    return res.data;
  },

  forgotPassword: async (data) => {
    const res = await api.post("/admin/forgotpassword", data);
    return res.data;
  },

  resetPassword: async (data) => {
    const res = await api.post(`/admin/resetpassword`, data);
    return res.data;
  },

  logout: async () => {
    const res = await api.get("/admin/logout");
    localStorage.removeItem("token");
    window.location.href = "/auth";
  },

  profile: async () => {
    const res = await api.get("/admin/profile");
    return res.data;
  },

  updateProfile: async () => {
    const res = await api.post("/admin/profile-update");
    return res.data;
  },

  mailToUser: async () => {
    const res = await api.post("/admin/send-mail");
    return res.data;
  },
};
