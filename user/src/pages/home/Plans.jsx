import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaHistory,
  FaCrown,
  FaTimes,
  FaCreditCard,
  FaUniversity,
  FaWallet,
  FaCalendarAlt,
  FaShieldAlt,
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

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState(null);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("manual");

  const [upgradeCalculation, setUpgradeCalculation] = useState(null);

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

  const getSubscription = async () => {
    try {
      const res = await subscriptionApi.get();

      setSubscription(res?.subscription || null);
    } catch (error) {
      console.log(error);
    }
  };

  const getHistory = async () => {
    try {
      const res = await subscriptionApi.history();

      setHistory(res?.subscriptions || []);
    } catch (error) {
      console.log(error);
    }
  };

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

    if (
      subscription?.status === "active" &&
      subscription?.planId !== plan?._id
    ) {
      const currentAmount = subscription?.amountPaid || 0;

      const totalDays =
        Math.ceil(
          (new Date(subscription?.endDate) -
            new Date(subscription?.startDate)) /
            (1000 * 60 * 60 * 24),
        ) || 30;

      const perDayPrice = currentAmount / totalDays;

      const remainingAmount = perDayPrice * remainingDays;

      const newPlanPrice =
        plan?.discountPrice > 0
          ? plan?.price - plan?.discountPrice
          : plan?.price;

      const finalPayable = Math.max(
        0,
        Math.round(newPlanPrice - remainingAmount),
      );

      setUpgradeCalculation({
        currentAmount,
        remainingAmount: Math.round(remainingAmount),
        newPlanPrice,
        finalPayable,
      });
    } else {
      setUpgradeCalculation(null);
    }

    setShowPaymentModal(true);
  };

  // =========================================
  // HANDLE PAYMENT
  // =========================================

  const handleCompletePayment = async () => {
    try {
      setBuyLoading(true);

      let subRes;

      const finalAmount =
        upgradeCalculation?.finalPayable ||
        (selectedPlan?.discountPrice > 0
          ? selectedPlan?.price - selectedPlan?.discountPrice
          : selectedPlan?.price);

      // =====================================
      // BUY / RENEW / UPGRADE
      // =====================================

      if (subscription?.status === "active") {
        // SAME PLAN => RENEW

        if (subscription?.planId === selectedPlan?._id) {
          subRes = await subscriptionApi.renew({
            planId: selectedPlan?._id,
          });
        } else {
          // DIFFERENT PLAN => UPGRADE

          subRes = await subscriptionApi.upgrade({
            newPlanId: selectedPlan?._id,
          });
        }
      } else {
        // NEW BUY

        subRes = await subscriptionApi.buy({
          planId: selectedPlan?._id,
        });
      }

      // =====================================
      // CREATE PAYMENT ENTRY
      // =====================================

      await paymentApi.create({
        subscriptionId: subRes?.subscription?._id,

        amount: finalAmount,

        paymentMethod: selectedPaymentMethod,
      });

      localStorage.setItem(
        "subscription",
        JSON.stringify(subRes?.subscription),
      );

      await getSubscription();

      await getHistory();

      await getPayments();

      setShowPaymentModal(false);

      setSelectedPlan(null);

      setUpgradeCalculation(null);

      alert(
        subscription?.status === "active"
          ? "Subscription Updated Successfully"
          : "Payment Successful & Subscription Activated",
      );

      navigate("/home");
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setBuyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-6 font-sans text-slate-900">
      {/* HEADER */}

      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Upgrade Your Experience
        </h1>

        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
          Scale your business with our professional plans.
        </p>
      </div>

      {/* SUBSCRIPTION CARD */}

      <div className="max-w-6xl mx-auto mb-12">
        <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-slate-100">
          {subscription && subscription?.status === "active" ? (
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                  <FaCrown className="text-4xl" />
                </div>

                <div>
                  <h2 className="text-3xl font-bold">
                    {subscription?.planName}
                  </h2>

                  <div className="flex flex-wrap gap-4 mt-3 text-slate-500">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt />

                      {new Date(subscription?.endDate).toLocaleDateString()}
                    </span>

                    <span className="flex items-center gap-1">
                      <FaShieldAlt />

                      {subscription?.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-400">Remaining</p>

                <p className="text-4xl font-bold text-indigo-600">
                  {remainingDays} Days
                </p>

                <button
                  onClick={async () => {
                    setShowHistory(!showHistory);

                    await getHistory();

                    await getPayments();
                  }}
                  className="mt-4 bg-slate-900 text-white px-6 py-3 rounded-xl flex items-center gap-2"
                >
                  <FaHistory />

                  {showHistory ? "Close History" : "View History"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">No Active Subscription</h2>

                <p className="text-slate-500 mt-2">Choose your first plan</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* HISTORY */}

      {showHistory && (
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-[2rem] shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-8">Transaction History</h2>

            {history?.length === 0 ? (
              <div>No history found</div>
            ) : (
              <div className="grid gap-4">
                {history?.map((item) => {
                  const payment = payments?.find(
                    (pay) => pay?.subscriptionId?._id === item?._id,
                  );

                  return (
                    <div
                      key={item?._id}
                      className="border rounded-2xl p-6 flex justify-between"
                    >
                      <div>
                        <h3 className="font-bold text-xl">{item?.planName}</h3>

                        <p className="text-slate-500">₹{item?.amountPaid}</p>
                      </div>

                      <div>
                        <span className="text-sm">
                          {payment?.status || "success"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PLANS */}

      {loading ? (
        <div className="flex justify-center py-20">Loading...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans?.map((plan) => {
            const finalPrice =
              plan?.discountPrice > 0
                ? plan?.price - plan?.discountPrice
                : plan?.price;

            return (
              <div
                key={plan?._id}
                className="bg-white rounded-[2rem] p-8 border"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold">{plan?.name}</h2>

                  <p className="text-slate-500 mt-2">{plan?.description}</p>
                </div>

                <div className="mb-8">
                  <h1 className="text-5xl font-black">₹{finalPrice}</h1>

                  <p className="text-slate-400 mt-2 uppercase text-sm">
                    {plan?.billingCycle}
                  </p>
                </div>

                <div className="space-y-3 mb-10">
                  {plan?.features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <FaCheck className="text-green-600" />

                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => openPaymentModal(plan)}
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  {subscription?.status === "active"
                    ? subscription?.planId === plan?._id
                      ? "Renew Plan"
                      : "Upgrade Plan"
                    : "Get Started"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* PAYMENT MODAL */}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-6 right-6"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-3xl font-bold mb-2">Checkout</h2>

            <p className="text-slate-500 mb-8">Complete your payment</p>

            {/* PLAN */}

            <div className="bg-indigo-50 rounded-2xl p-6 mb-6 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl">{selectedPlan?.name}</h3>

                <p className="text-slate-500 text-sm">
                  {selectedPlan?.billingCycle}
                </p>
              </div>

              <h1 className="text-3xl font-black">
                ₹
                {selectedPlan?.discountPrice > 0
                  ? selectedPlan?.price - selectedPlan?.discountPrice
                  : selectedPlan?.price}
              </h1>
            </div>

            {/* UPGRADE CALCULATION */}

            {upgradeCalculation && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
                <h3 className="font-bold text-amber-800 mb-4">
                  Upgrade Adjustment
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Current Plan Credit</span>

                    <span className="font-semibold text-green-600">
                      - ₹{upgradeCalculation?.remainingAmount}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>New Plan Price</span>

                    <span>₹{upgradeCalculation?.newPlanPrice}</span>
                  </div>

                  <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                    <span>Final Payable</span>

                    <span className="text-indigo-600">
                      ₹{upgradeCalculation?.finalPayable}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENT METHODS */}

            <div className="space-y-3">
              {[
                {
                  id: "manual",
                  icon: FaWallet,
                  title: "Manual",
                },
                {
                  id: "razorpay",
                  icon: FaCreditCard,
                  title: "Razorpay",
                },
                {
                  id: "paypal",
                  icon: FaUniversity,
                  title: "Paypal",
                },
              ].map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`border-2 rounded-2xl p-4 flex items-center gap-4 cursor-pointer ${
                    selectedPaymentMethod === method.id
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-slate-100"
                  }`}
                >
                  <method.icon />

                  <span className="font-medium">{method.title}</span>
                </div>
              ))}
            </div>

            {/* PAY BUTTON */}

            <button
              disabled={buyLoading}
              onClick={handleCompletePayment}
              className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-5 rounded-2xl font-bold mt-8"
            >
              {buyLoading ? "Processing..." : `Confirm & Pay`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
