import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaHistory,
  FaCrown,
  FaTimes,
  FaCreditCard,
  FaUniversity,
  FaWallet,
} from "react-icons/fa";

import { plansApi } from "../../apis/plans";
import { subscriptionApi } from "../../apis/subscription";
import { paymentApi } from "../../apis/payment";
import { useNavigate } from "react-router-dom";

export const Plans = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const [buyLoading, setBuyLoading] = useState(false);

  const [subscription, setSubscription] = useState(null);

  const [history, setHistory] = useState([]);

  const [payments, setPayments] = useState([]);

  const [showHistory, setShowHistory] = useState(false);

  // =========================================
  // PAYMENT MODAL
  // =========================================

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState(null);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("manual");

  // =========================================
  // GET PLANS
  // =========================================

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

  // =========================================
  // GET SUBSCRIPTION
  // =========================================

  const getSubscription = async () => {
    try {
      const res = await subscriptionApi.get();

      setSubscription(res?.subscription || null);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================================
  // GET HISTORY
  // =========================================

  const getHistory = async () => {
    try {
      const res = await subscriptionApi.history();

      setHistory(res?.subscriptions || []);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================================
  // GET PAYMENTS
  // =========================================

  const getPayments = async () => {
    try {
      const res = await paymentApi.history();

      setPayments(res?.payments || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPlans();

    getSubscription();

    getPayments();
  }, []);

  // =========================================
  // REMAINING DAYS
  // =========================================

  const remainingDays = subscription?.endDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(subscription?.endDate) - new Date()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  // =========================================
  // OPEN PAYMENT MODAL
  // =========================================

  const openPaymentModal = (plan) => {
    setSelectedPlan(plan);

    setShowPaymentModal(true);
  };

  // =========================================
  // COMPLETE PAYMENT
  // =========================================

  const handleCompletePayment = async () => {
    try {
      setBuyLoading(true);

      let subRes;

      const finalAmount =
        selectedPlan?.discountPrice > 0
          ? selectedPlan?.price - selectedPlan?.discountPrice
          : selectedPlan?.price;

      // =====================================
      // CREATE / RENEW SUBSCRIPTION
      // =====================================

      if (subscription?.status === "active") {
        subRes = await subscriptionApi.renew({
          planId: selectedPlan?._id,
        });
      } else {
        subRes = await subscriptionApi.buy({
          planId: selectedPlan?._id,
        });
      }

      console.log("subscription =>", subRes);

      // =====================================
      // CREATE PAYMENT
      // =====================================

      const paymentRes = await paymentApi.create({
        subscriptionId: subRes?.subscription?._id,

        amount: finalAmount,

        paymentMethod: selectedPaymentMethod,
      });

      console.log("payment =>", paymentRes);

      // =====================================
      // SAVE
      // =====================================

      localStorage.setItem(
        "subscription",
        JSON.stringify(subRes?.subscription),
      );

      // =====================================
      // REFRESH
      // =====================================

      await getSubscription();

      await getHistory();

      await getPayments();

      // =====================================
      // CLOSE MODAL
      // =====================================

      setShowPaymentModal(false);

      setSelectedPlan(null);

      // =====================================
      // SUCCESS
      // =====================================

      alert(
        subscription?.status === "active"
          ? "Subscription Renewed Successfully"
          : "Payment Successful & Subscription Activated",
      );

      // =====================================
      // REDIRECT
      // =====================================

      navigate("/home");
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setBuyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-14 px-5">
      {/* ===================================== */}
      {/* HEADING */}
      {/* ===================================== */}

      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900">Choose Your Plan</h1>

        <p className="text-gray-500 mt-4 text-lg">
          Flexible pricing for every business
        </p>
      </div>

      {/* ===================================== */}
      {/* SUBSCRIPTION STATUS */}
      {/* ===================================== */}

      <div className="max-w-6xl mx-auto mb-10">
        <div className="bg-white rounded-3xl shadow-lg p-7 border">
          {subscription && subscription?.status === "active" ? (
            <div className="flex flex-col lg:flex-row justify-between gap-8 items-center">
              <div>
                <div className="flex items-center gap-3">
                  <FaCrown className="text-yellow-500 text-3xl" />

                  <h2 className="text-3xl font-bold text-green-600">
                    Active Subscription
                  </h2>
                </div>

                <div className="mt-5 space-y-2">
                  <p className="text-lg">
                    Plan :
                    <span className="font-bold ml-2">
                      {subscription?.planName}
                    </span>
                  </p>

                  <p className="text-lg">
                    Remaining Days :
                    <span className="font-bold text-blue-600 ml-2">
                      {remainingDays} Days
                    </span>
                  </p>

                  <p className="text-lg">
                    Status :
                    <span className="font-bold text-green-600 capitalize ml-2">
                      {subscription?.status}
                    </span>
                  </p>

                  <p className="text-lg">
                    Expire :
                    <span className="font-bold ml-2">
                      {new Date(subscription?.endDate).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={async () => {
                  setShowHistory(!showHistory);

                  await getHistory();

                  await getPayments();
                }}
                className="bg-black text-white px-6 py-4 rounded-2xl flex items-center gap-3"
              >
                <FaHistory />

                {showHistory ? "Hide History" : "View History"}
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center flex-col lg:flex-row gap-5">
              <div>
                <h2 className="text-3xl font-bold text-red-500">
                  No Active Subscription
                </h2>

                <p className="text-gray-500 mt-3">
                  Buy a plan to unlock premium features
                </p>
              </div>

              <button
                onClick={async () => {
                  setShowHistory(!showHistory);

                  await getHistory();

                  await getPayments();
                }}
                className="bg-black text-white px-6 py-4 rounded-2xl flex items-center gap-3"
              >
                <FaHistory />

                {showHistory ? "Hide History" : "View History"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===================================== */}
      {/* HISTORY */}
      {/* ===================================== */}

      {showHistory && (
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white rounded-3xl shadow-lg p-7 border">
            <h2 className="text-3xl font-bold mb-8">Subscription History</h2>

            {history?.length === 0 ? (
              <p>No History Found</p>
            ) : (
              <div className="space-y-5">
                {history?.map((item) => {
                  const payment = payments?.find(
                    (pay) => pay?.subscriptionId?._id === item?._id,
                  );

                  return (
                    <div key={item?._id} className="border rounded-2xl p-5">
                      <div className="flex flex-col lg:flex-row justify-between gap-5">
                        <div>
                          <h2 className="text-2xl font-bold">
                            {item?.planName}
                          </h2>

                          <p className="mt-2 capitalize">
                            {item?.billingCycle}
                          </p>

                          <p className="mt-2">
                            Duration : {item?.totalDays} Days
                          </p>

                          <p className="mt-2">
                            Start :{" "}
                            {new Date(item?.startDate).toLocaleDateString()}
                          </p>

                          <p className="mt-2">
                            End : {new Date(item?.endDate).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-2xl font-bold text-green-600">
                            ₹{item?.amountPaid}
                          </p>

                          <p className="capitalize text-blue-600 font-bold">
                            {item?.status}
                          </p>

                          <p>
                            Payment :
                            <span className="ml-2 font-semibold capitalize">
                              {payment?.status || "success"}
                            </span>
                          </p>

                          <p>
                            Method :
                            <span className="ml-2 font-semibold capitalize">
                              {payment?.paymentGateway || "manual"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================== */}
      {/* PLANS */}
      {/* ===================================== */}

      {loading ? (
        <div className="text-center text-2xl font-bold">Loading Plans...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans?.map((plan) => {
            const finalPrice =
              plan?.discountPrice > 0
                ? plan?.price - plan?.discountPrice
                : plan?.price;

            const discountPercentage =
              plan?.discountPrice > 0
                ? Math.round((plan?.discountPrice / plan?.price) * 100)
                : 0;

            return (
              <div
                key={plan?._id}
                className="bg-white rounded-3xl shadow-lg p-8 border hover:shadow-2xl transition relative"
              >
                {discountPercentage > 0 && (
                  <div className="absolute top-5 right-5 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                    {discountPercentage}% OFF
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-3xl font-bold">{plan?.name}</h2>

                  <p className="text-gray-500 mt-3">{plan?.description}</p>
                </div>

                {/* PRICE */}

                <div className="mb-7">
                  <div className="flex items-end gap-3 flex-wrap">
                    <h1 className="text-5xl font-bold">₹{finalPrice}</h1>

                    {plan?.discountPrice > 0 && (
                      <p className="line-through text-gray-400 text-2xl">
                        ₹{plan?.price}
                      </p>
                    )}
                  </div>

                  <span className="inline-block mt-4 bg-black text-white px-4 py-2 rounded-full text-sm capitalize">
                    {plan?.billingCycle}
                  </span>
                </div>

                {/* DETAILS */}

                <div className="mb-7 space-y-2">
                  <p>
                    Duration :
                    <span className="font-bold ml-2">
                      {plan?.durationDays} Days
                    </span>
                  </p>

                  {plan?.isFreeTrial && (
                    <p className="text-green-600 font-semibold">
                      {plan?.trialDays} Days Free Trial
                    </p>
                  )}
                </div>

                {/* FEATURES */}

                <div className="space-y-4 mb-8">
                  {plan?.features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <FaCheck className="text-green-500" />

                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* BUTTON */}

                <button
                  onClick={() => openPaymentModal(plan)}
                  className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-2xl font-bold"
                >
                  {subscription?.status === "active" ? "Renew Plan" : "Buy Now"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ===================================== */}
      {/* PAYMENT MODAL */}
      {/* ===================================== */}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 relative">
            {/* CLOSE */}

            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-5 right-5 text-gray-500 text-xl"
            >
              <FaTimes />
            </button>

            {/* TITLE */}

            <h2 className="text-3xl font-bold mb-2">Select Payment Method</h2>

            <p className="text-gray-500 mb-8">Complete your payment securely</p>

            {/* PLAN */}

            <div className="bg-gray-100 rounded-2xl p-5 mb-6">
              <h3 className="text-2xl font-bold">{selectedPlan?.name}</h3>

              <p className="text-gray-500 mt-2">{selectedPlan?.description}</p>

              <h1 className="text-4xl font-bold mt-4">
                ₹
                {selectedPlan?.discountPrice > 0
                  ? selectedPlan?.price - selectedPlan?.discountPrice
                  : selectedPlan?.price}
              </h1>
            </div>

            {/* METHODS */}

            <div className="space-y-4">
              {/* MANUAL */}

              <div
                onClick={() => setSelectedPaymentMethod("manual")}
                className={`border rounded-2xl p-5 cursor-pointer transition ${
                  selectedPaymentMethod === "manual"
                    ? "border-black bg-gray-100"
                    : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <FaWallet className="text-2xl" />

                  <div>
                    <h3 className="font-bold text-lg">Manual Payment</h3>

                    <p className="text-gray-500 text-sm">
                      Cash / Offline Payment
                    </p>
                  </div>
                </div>
              </div>

              {/* RAZORPAY */}

              <div
                onClick={() => setSelectedPaymentMethod("razorpay")}
                className={`border rounded-2xl p-5 cursor-pointer transition ${
                  selectedPaymentMethod === "razorpay"
                    ? "border-black bg-gray-100"
                    : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <FaCreditCard className="text-2xl" />

                  <div>
                    <h3 className="font-bold text-lg">Razorpay</h3>

                    <p className="text-gray-500 text-sm">
                      UPI / Card / Net Banking
                    </p>
                  </div>
                </div>
              </div>

              {/* BANK */}

              <div
                onClick={() => setSelectedPaymentMethod("paypal")}
                className={`border rounded-2xl p-5 cursor-pointer transition ${
                  selectedPaymentMethod === "paypal"
                    ? "border-black bg-gray-100"
                    : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <FaUniversity className="text-2xl" />

                  <div>
                    <h3 className="font-bold text-lg">Paypal</h3>

                    <p className="text-gray-500 text-sm">
                      International Payment
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PAY BUTTON */}

            <button
              disabled={buyLoading}
              onClick={handleCompletePayment}
              className="w-full bg-black text-white py-4 rounded-2xl font-bold mt-8"
            >
              {buyLoading
                ? "Processing Payment..."
                : `Pay Now with ${selectedPaymentMethod}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
