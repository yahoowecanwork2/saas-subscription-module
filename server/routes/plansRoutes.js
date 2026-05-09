import express from "express";

import isAuthenticated from "../middleware/isAuthenticated.js";
import checkAdmin from "../middleware/checkAdmin.js";
import {
  createPlan,
  deletePlan,
  getActivePlans,
  getAllPlans,
  getSinglePlan,
  updatePlan,
} from "../controllers/planController.js";

const plansRoutes = express.Router();

// .........................................admin routes........................................>

plansRoutes.post("/create", isAuthenticated, checkAdmin, createPlan);

plansRoutes.put("/update/:id", isAuthenticated, checkAdmin, updatePlan);

plansRoutes.delete("/delete/:id", isAuthenticated, checkAdmin, deletePlan);
// .............................................................user route................>

plansRoutes.get("/all", getAllPlans);

plansRoutes.get("/active", getActivePlans);

plansRoutes.get("/single/:id", getSinglePlan);

export default plansRoutes;
