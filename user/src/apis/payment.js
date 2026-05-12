import { api } from "./index";

export const paymentApi = {
 

  createOrder: async (data) => {
    const res = await api.post(`/payment/create-order`, data);

    return res.data;
  },


  verify: async (data) => {
    const res = await api.post(`/payment/verify`, data);

    return res.data;
  },


  history: async () => {
    const res = await api.get(`/payment/history`);

    return res.data;
  },
};
