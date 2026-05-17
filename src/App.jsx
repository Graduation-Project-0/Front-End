import React from "react";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";

import HeroSection from "./components/HeroSection";
import About from "./components/About";
import Services from "./components/Services";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import ScrollToSection from "./components/ScrollToSection";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Reset from "./pages/Reset";
import ConfirmPass from "./pages/ConfirmPass";
import VerifyCode from "./pages/VerifyCode";
import FilePage from "./pages/FilePage";
import UrlPage from "./pages/UrlPage";
import EmailPage from "./pages/EmailPage";
import FileStandard from "./pages/FileStandard";
import FileAdvanced from "./pages/FileAdvanced";
import UrlStandard from "./pages/UrlStandard";
import UrlAdvanced from "./pages/UrlAdvanced";
import EmailOutput from "./pages/EmailOutput";
import Dashboard from "./pages/Dashboard";
import Plans from "./pages/Plans";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import VerifyEmail from "./pages/verifyEmail";
import VerifyEmailNotice from "./pages/VerifyEmailNotice";

import ProtectedRoute from "./context/ProtectedRoute";

function AppInner() {
  const location = useLocation();

  const noWrapperRoutes = [
    "/dashboard",
    "/login",
    "/signup",
    "/plans",
    "/file",
    "/url",
    "/email",
    "/verify",
    "/reset",
    "/confirm",
    


  ];
  const path =
    location.pathname.length > 1 && location.pathname.endsWith("/")
      ? location.pathname.slice(0, -1)
      : location.pathname;
  const isNoWrapper = noWrapperRoutes.includes(path);

  return (
    <div
      className={
        isNoWrapper
          ? "min-h-screen "
          :"container mx-auto pt-20 overflow-hidden "
      }
    >
      <ScrollToSection />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/confirm" element={<ConfirmPass />} />
        <Route path="/verify" element={<VerifyCode />} />
        <Route path="/plans" element={<Plans />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/email-verified" element={<VerifyEmail />} />
          <Route path="/verify-email-notice" element={<VerifyEmailNotice />} />

          <Route element={<Layout />}>
            <Route path="/file" element={<FilePage />} />
            <Route path="/url" element={<UrlPage />} />
            <Route path="/email" element={<EmailPage />} />
            <Route path="/filestandard" element={<FileStandard />} />
            <Route path="/fileadvanced" element={<FileAdvanced />} />
            <Route path="/urlstandard" element={<UrlStandard />} />
            <Route path="/urladvanced" element={<UrlAdvanced />} />
            <Route path="/email-output" element={<EmailOutput />} />
          </Route>
        </Route>

        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <About />
                <Services />
                <HowItWorks />
                <Footer />
              </>
            }
          />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Route>
      </Routes>
    </div>
  );
}

export default function App() {
  return <AppInner />;
}
