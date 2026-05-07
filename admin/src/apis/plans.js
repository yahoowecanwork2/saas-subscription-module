import { api } from "./index";

export const plansApi = {
  create: async (data) => {
    const res = await api.post("/plan/create", data);
    return res.data;
  },

  update: async (data, id) => {
    const res = await api.put(`/plan/update/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/plan/delete/${id}`);
    return res.data;
  },

  getAll: async () => {
    const res = await api.get(`/plan/all`);
    return res.data;
  },
};
