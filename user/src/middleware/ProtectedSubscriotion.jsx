import { Navigate } from "react-router-dom";

const ProtectedSubscription = ({ children }) => {
  const subscription = JSON.parse(localStorage.getItem("subscription"));

  if (!subscription) {
    return <Navigate to="/plans" />;
  }

  if (subscription?.status !== "active") {
    return <Navigate to="/plans" />;
  }

  return children;
};

export default ProtectedSubscription;
