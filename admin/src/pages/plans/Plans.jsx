import React, { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import { plansApi } from "../../apis/plans";
import Updateplans from "./modal/Updateplans";
import Create from "./modal/Create";

const Plans = () => {
  const [plans, setPlans] = useState([]);

  const [openCreate, setOpenCreate] = useState(false);

  const [openUpdate, setOpenUpdate] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState(null);

  // ================= GET ALL =================

  const getPlans = async () => {
    try {
      const res = await plansApi.getAll();

      setPlans(res?.plans || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPlans();
  }, []);

  // ================= DELETE =================

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure want to delete?");

      if (!confirmDelete) return;

      await plansApi.delete(id);

      getPlans();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="p-5">
        {/* HEADER */}

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold">Plans</h1>

          <button
            onClick={() => setOpenCreate(true)}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3">Name</th>

                <th className="border p-3">Billing</th>

                <th className="border p-3">Duration</th>

                <th className="border p-3">Price</th>

                <th className="border p-3">Trial</th>

                <th className="border p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {plans?.map((item) => (
                <tr key={item._id}>
                  <td className="border p-3">{item.name}</td>

                  <td className="border p-3 capitalize">{item.billingCycle}</td>

                  <td className="border p-3">{item.durationDays} Days</td>

                  <td className="border p-3">₹ {item.price}</td>

                  <td className="border p-3">
                    {item.isFreeTrial ? `${item.trialDays} Days` : "No"}
                  </td>

                  <td className="border p-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedPlan(item);
                          setOpenUpdate(true);
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CREATE MODAL */}

        {openCreate && (
          <Create setOpenCreate={setOpenCreate} getPlans={getPlans} />
        )}

        {/* UPDATE MODAL */}

        {openUpdate && (
          <Updateplans
            selectedPlan={selectedPlan}
            setOpenUpdate={setOpenUpdate}
            getPlans={getPlans}
          />
        )}
      </div>
    </Layout>
  );
};

export default Plans;
