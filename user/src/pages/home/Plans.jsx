import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { plansApi } from "../../apis/plans";

export const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= GET ACTIVE PLANS =================

  const getPlans = async () => {
    try {
      setLoading(true);

      const res = await plansApi.active();

      setPlans(res?.plans || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlans();
  }, []);

  // ================= BUY =================

  const handleBuy = async (plan) => {
    console.log("Selected Plan:", plan);

    // payment/subscription api yaha integrate hogi
  };

  return (
    <div className="min-h-screen bg-gray-50 py-14 px-5">
      {/* HEADING */}

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">
          Choose Your Plan
        </h1>

        <p className="text-gray-500 mt-3">
          Flexible pricing for every business
        </p>
      </div>

      {/* LOADING */}

      {loading ? (
        <div className="text-center text-xl font-semibold">
          Loading...
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans?.map((plan) => {
            // ================= FINAL PRICE =================

            const finalPrice =
              plan?.discountPrice > 0
                ? plan?.price -
                  plan?.discountPrice
                : plan?.price;

            // ================= DISCOUNT PERCENT =================

            const discountPercentage =
              plan?.discountPrice > 0
                ? Math.round(
                    (plan?.discountPrice /
                      plan?.price) *
                      100,
                  )
                : 0;

            return (
              <div
                key={plan?._id}
                className="bg-white rounded-2xl shadow-md p-7 border hover:shadow-2xl transition duration-300 relative"
              >
                {/* TOP BADGE */}

                {discountPercentage > 0 && (
                  <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">
                    {discountPercentage}% OFF
                  </div>
                )}

                {/* PLAN NAME */}

                <div className="mb-5">
                  <h2 className="text-2xl font-bold">
                    {plan?.name}
                  </h2>

                  <p className="text-gray-500 mt-2">
                    {plan?.description}
                  </p>
                </div>

                {/* PRICE */}

                <div className="mb-6">
                  <div className="flex items-end gap-3 flex-wrap">
                    {/* FINAL PRICE */}

                    <h1 className="text-5xl font-bold">
                      ₹{finalPrice}
                    </h1>

                    {/* ORIGINAL PRICE */}

                    {plan?.discountPrice > 0 && (
                      <p className="text-gray-400 line-through text-2xl mb-1">
                        ₹{plan?.price}
                      </p>
                    )}

                    {/* OFF BADGE */}

                    {discountPercentage > 0 && (
                      <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full mb-2">
                        {discountPercentage}% OFF
                      </span>
                    )}
                  </div>

                  {/* BILLING */}

                  <span className="inline-block mt-4 bg-black text-white text-sm px-3 py-1 rounded-full capitalize">
                    {plan?.billingCycle}
                  </span>
                </div>

                {/* DURATION */}

                <div className="mb-5">
                  <p className="text-gray-700">
                    Duration :{" "}
                    <span className="font-semibold">
                      {plan?.durationDays} Days
                    </span>
                  </p>

                  {plan?.isFreeTrial && (
                    <p className="text-green-600 mt-2 font-medium">
                      {plan?.trialDays} Days Free Trial
                    </p>
                  )}
                </div>

                {/* FEATURES */}

                <div className="space-y-3 mb-8">
                  {plan?.features?.map(
                    (feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3"
                      >
                        <FaCheck className="text-green-500" />

                        <span className="text-gray-700">
                          {feature}
                        </span>
                      </div>
                    ),
                  )}
                </div>

                {/* BUY BUTTON */}

                <button
                  onClick={() => handleBuy(plan)}
                  className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition duration-300 font-semibold"
                >
                  Buy Now
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};