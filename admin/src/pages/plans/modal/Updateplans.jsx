import React, { useState } from "react";
import { plansApi } from "../../../apis/plans";

const Updateplans = ({ selectedPlan, setOpenUpdate, getPlans }) => {
  const [formData, setFormData] = useState({
    name: selectedPlan?.name || "",
    slug: selectedPlan?.slug || "",
    description: selectedPlan?.description || "",
    billingCycle: selectedPlan?.billingCycle || "monthly",
    durationDays: selectedPlan?.durationDays || "",
    price: selectedPlan?.price || "",
    discountPrice: selectedPlan?.discountPrice || "",
    features: selectedPlan?.features?.join(", ") || "",
    isFreeTrial: selectedPlan?.isFreeTrial || false,
    trialDays: selectedPlan?.trialDays || "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,

        features: formData.features.split(",").map((item) => item.trim()),
      };

      await plansApi.update(payload, selectedPlan._id);

      getPlans();

      setOpenUpdate(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded w-[500px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-5">Update Plan</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            className="w-full border p-2"
            onChange={handleChange}
          />

          <input
            type="text"
            name="slug"
            value={formData.slug}
            className="w-full border p-2"
            onChange={handleChange}
          />

          <textarea
            name="description"
            value={formData.description}
            className="w-full border p-2"
            onChange={handleChange}
          />

          <select
            name="billingCycle"
            value={formData.billingCycle}
            className="w-full border p-2"
            onChange={handleChange}
          >
            <option value="monthly">Monthly</option>

            <option value="yearly">Yearly</option>

            <option value="free">Free</option>
          </select>

          <input
            type="number"
            name="durationDays"
            value={formData.durationDays}
            className="w-full border p-2"
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            value={formData.price}
            className="w-full border p-2"
            onChange={handleChange}
          />

          <input
            type="number"
            name="discountPrice"
            value={formData.discountPrice}
            className="w-full border p-2"
            onChange={handleChange}
          />

          <textarea
            name="features"
            value={formData.features}
            className="w-full border p-2"
            onChange={handleChange}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFreeTrial"
              checked={formData.isFreeTrial}
              onChange={handleChange}
            />

            <label>Free Trial</label>
          </div>

          <input
            type="number"
            name="trialDays"
            value={formData.trialDays}
            className="w-full border p-2"
            onChange={handleChange}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpenUpdate(false)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button className="bg-black text-white px-4 py-2 rounded">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Updateplans;
