import { api } from "./index";

export const subscriptionApi = {
  buy: async (data) => {
    const res = await api.post(`/subscription/buy`, data);
    return res.data;
  },

  upgrade: async (data) => {
    const res = await api.post(`/subscription/upgrade`, data);
    return res.data;
  },

  renew: async (data) => {
    const res = await api.post(`/subscription/renew`, data);
    return res.data;
  },

  cancel: async () => {
    const res = await api.post(`/subscription/cancel`);
    return res.data;
  },

  get: async () => {
    const res = await api.get(`/subscription/my`);
    return res.data;
  },

  history: async () => {
    const res = await api.get(`/subscription/history`);
    return res.data;
  },
};
