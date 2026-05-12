import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { subscriptionApi } from "../apis/subscription";

const ProtectedSubscription = ({ children }) => {
  const [loading, setLoading] = useState(true);

  // ✅ null initially
  const [hasSubscription, setHasSubscription] = useState(null);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const res = await subscriptionApi.get();

      const subscription = res?.subscription;

      const isActive =
        subscription?.status === "active" &&
        new Date(subscription?.endDate).getTime() > Date.now();

      setHasSubscription(isActive);
    } catch (error) {
      console.log(error);

      setHasSubscription(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ WAIT
  if (loading || hasSubscription === null) {
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-2xl font-bold">Checking Subscription...</h1>
      </div>
    );
  }

  if (hasSubscription === false) {
    return <Navigate to="/plans" replace />;
  }

  return children;
};

export default ProtectedSubscription;
