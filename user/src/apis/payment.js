import { api } from "./index";

export const paymentApi = {
  create: async (data) => {
    const res = await api.post(`/payment/create`, data);

    return res.data;
  },

  history: async () => {
    const res = await api.get(`/payment/history`);

    return res.data;
  },
};
