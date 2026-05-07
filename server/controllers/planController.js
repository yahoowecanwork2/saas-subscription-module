import { Plan } from "../models/plan.js";

export const createPlan = async (req, res) => {
  const {
    name,
    slug,
    description,
    billingCycle,
    durationDays,
    price,
    discountPrice,
    features,
    isFreeTrial,
    trialDays,
  } = req.body;

  const existingPlan = await Plan.findOne({
    slug,
  });

  if (existingPlan) {
    return res.status(400).json({
      success: false,
      message: "Plan already exists",
    });
  }

  const plan = await Plan.create({
    name,
    slug,
    description,
    billingCycle,
    durationDays,
    price,
    discountPrice,
    features,
    isFreeTrial,
    trialDays,
  });

  res.status(201).json({
    success: true,
    message: "Plan created successfully",
    plan,
  });
};

export const getAllPlans = async (req, res) => {
  const plans = await Plan.find().sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    totalPlans: plans.length,
    plans,
  });
};

export const getSinglePlan = async (req, res) => {
  const { id } = req.params;

  const plan = await Plan.findById(id);

  if (!plan) {
    return res.status(404).json({
      success: false,
      message: "Plan not found",
    });
  }

  res.status(200).json({
    success: true,
    plan,
  });
};

export const updatePlan = async (req, res) => {
  const { id } = req.params;

  const updatedPlan = await Plan.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedPlan) {
    return res.status(404).json({
      success: false,
      message: "Plan not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Plan updated successfully",
    updatedPlan,
  });
};

export const deletePlan = async (req, res) => {
  const { id } = req.params;

  const plan = await Plan.findById(id);

  if (!plan) {
    return res.status(404).json({
      success: false,
      message: "Plan not found",
    });
  }

  await Plan.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Plan deleted successfully",
  });
};

export const getActivePlans = async (req, res) => {
  const plans = await Plan.find({
    isActive: true,
  });

  res.status(200).json({
    success: true,
    plans,
  });
};
