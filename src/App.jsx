import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";

// Components & Pages
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
import Dashboard from "./pages/DashBoard";
import Plans from "./pages/Plans";

// Context & Protection
import ProtectedRoute from "./context/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="h-full w-full overflow-x-hidden">
        <ScrollToSection />

        <Routes>
          {/* 1. مسارات متاحة للجميع (Public) وبدون Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/confirm" element={<ConfirmPass />} />
          <Route path="/verify" element={<VerifyCode />} />
          <Route path="/plans" element={<Plans />} />

          {/* 2. مسارات محمية (Protected) */}
          <Route element={<ProtectedRoute />}>
            
            {/* داشبورد محمية وبدون Layout */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* مسارات محمية وبتحتاج Layout */}
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

          {/* 3. مسارات متاحة للجميع ولكن بـ Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={
              <>
                <HeroSection />
                <About />
                <Services />
                <HowItWorks />
                <Footer />
              </>
            } />

          </Route>

        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;