import React, { useState } from "react";
import { plansApi } from "../../../apis/plans";

const Create = ({ setOpenCreate, getPlans }) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    billingCycle: "monthly",
    durationDays: "",
    price: "",
    discountPrice: "",
    features: "",
    isFreeTrial: false,
    trialDays: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,

        features: formData.features.split(",").map((item) => item.trim()),
      };

      const res = await plansApi.create(payload);
      console.log("create", res);

      getPlans();

      setOpenCreate(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded w-[500px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-5">Create Plan</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Plan Name"
            className="w-full border p-2"
            onChange={handleChange}
          />

          <input
            type="text"
            name="slug"
            placeholder="Slug"
            className="w-full border p-2"
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            className="w-full border p-2"
            onChange={handleChange}
          />

          <select
            name="billingCycle"
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
            placeholder="Duration Days"
            className="w-full border p-2"
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            className="w-full border p-2"
            onChange={handleChange}
          />

          <input
            type="number"
            name="discountPrice"
            placeholder="Discount Price"
            className="w-full border p-2"
            onChange={handleChange}
          />

          <textarea
            name="features"
            placeholder="Features comma separated"
            className="w-full border p-2"
            onChange={handleChange}
          />

          <div className="flex items-center gap-2">
            <input type="checkbox" name="isFreeTrial" onChange={handleChange} />

            <label>Free Trial</label>
          </div>

          <input
            type="number"
            name="trialDays"
            placeholder="Trial Days"
            className="w-full border p-2"
            onChange={handleChange}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpenCreate(false)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button className="bg-black text-white px-4 py-2 rounded">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
