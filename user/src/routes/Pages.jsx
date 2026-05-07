import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Resetpassword from "../pages/auth/Resetpassword";

const Pages = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Suspense fallback={<h1 className="text-xl">Loading ......</h1>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resetpassword" element={<Resetpassword />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default Pages;
