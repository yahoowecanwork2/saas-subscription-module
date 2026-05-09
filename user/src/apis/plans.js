import { api } from "./index";

export const plansApi = {
  getAll: async () => {
    const res = await api.get(`/plan/all`);
    return res.data;
  },
  active: async () => {
    const res = await api.get(`/plan/active`);
    return res.data;
  },
  single: async (id) => {
    const res = await api.get(`/plan/single/${id}`);
    return res.data;
  },
};
