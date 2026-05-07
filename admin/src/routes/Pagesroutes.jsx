import React from "react";
import { Toaster } from "react-hot-toast";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Resetpassword from "../pages/auth/Resetpassword";
import { Navigate, Route, Routes } from "react-router-dom";
import Plans from "../pages/plans/Plans";

const Pagesroutes = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/resetpassword" element={<Resetpassword />} />
        <Route path="/plans" element={<Plans />} />

        {/* <Route path="/payments" element={<Payments />} /> */}
      </Routes>
    </>
  );
};

export default Pagesroutes;
