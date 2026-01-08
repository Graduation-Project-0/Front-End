import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import About from './components/About';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Reset from "./pages/Reset";
import ConfirmPass from "./pages/ConfirmPass";
import VerifyCode from "./pages/VerifyCode";
import FilePage from "./pages/FilePage";
import UrlPage from './pages/UrlPage';
import EmailPage from './pages/EmailPage';
import ScrollToSection from './components/ScrollToSection'; 
import { Routes, Route } from 'react-router-dom';
import FileStandard from './pages/FileStandard';
import FileAdvanced from './pages/FileAdvanced';
import UrlStandard from './pages/UrlStandard';
import UrlAdvanced from './pages/UrlAdvanced';
import EmailOutput from './pages/EmailOutput';
import Dashboard from './pages/DashBoard';
import ProtectedRoute from './auth/ProtectedRoute';
import {AuthProvider}  from './auth/AuthProvider';
import Layout from './components/Layout';



function App() {
  return (
      <AuthProvider>
      
    <div className="h-full w-full overflow-x-hidden">
<Layout>
      <ScrollToSection />
   
      <Routes>
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
        <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset" element={<Reset />} />
                  <Route path="/confirm" element={<ConfirmPass />} />
        <Route path="/verify" element={<VerifyCode />} />
                <Route path="/file" element={ <FilePage />} />                
                <Route path="/url" element={<UrlPage />} />
                   <Route path="/email" element={<EmailPage />} />
                <Route path="/filestandard" element={<FileStandard />} />
                <Route path="/fileadvanced" element={<FileAdvanced />} />
                <Route path="/urlstandard" element={<UrlStandard />} />
                <Route path="/urladvanced" element={<UrlAdvanced />} />
                <Route path="/email-output" element={<EmailOutput />} />
                <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
     </Layout>
    </div>
    
     </AuthProvider>
  );
}

export default App;
