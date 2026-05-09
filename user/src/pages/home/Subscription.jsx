import React, { useEffect, useState } from "react";
import { subscriptionApi } from "../../apis/subscription";

const Subscription = () => {
  const [subscription, setSubscription] = useState(null);

  const [loading, setLoading] = useState(false);

  // ================= GET SUBSCRIPTION =================

  const getSubscription = async () => {
    try {
      setLoading(true);

      const res = await subscriptionApi.get();

      setSubscription(res?.subscription);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubscription();
  }, []);

  // ================= CANCEL =================

  const handleCancel = async () => {
    try {
      const confirmCancel = window.confirm(
        "Are you sure want to cancel subscription?",
      );

      if (!confirmCancel) return;

      const res = await subscriptionApi.cancel();

      alert(res?.message);

      getSubscription();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 border">
        <h1 className="text-3xl font-bold mb-6">My Subscription</h1>

        {subscription ? (
          <>
            <div className="space-y-4">
              <p>
                <span className="font-semibold">Plan:</span>{" "}
                {subscription?.planName}
              </p>

              <p>
                <span className="font-semibold">Billing:</span>{" "}
                {subscription?.billingCycle}
              </p>

              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span className="capitalize">{subscription?.status}</span>
              </p>

              <p>
                <span className="font-semibold">Remaining Days:</span>{" "}
                {subscription?.remainingDays}
              </p>

              <p>
                <span className="font-semibold">Start Date:</span>{" "}
                {new Date(subscription?.startDate).toLocaleDateString()}
              </p>

              <p>
                <span className="font-semibold">End Date:</span>{" "}
                {new Date(subscription?.endDate).toLocaleDateString()}
              </p>

              <p>
                <span className="font-semibold">Amount Paid:</span> ₹
                {subscription?.amountPaid}
              </p>
            </div>

            {/* CANCEL BUTTON */}

            {subscription?.status === "active" && (
              <button
                onClick={handleCancel}
                className="mt-8 bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600"
              >
                Cancel Subscription
              </button>
            )}
          </>
        ) : (
          <p>No Active Subscription</p>
        )}
      </div>
    </div>
  );
};

export default Subscription;
