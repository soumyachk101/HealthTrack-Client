import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/auth/Auth'
import Dashboard from './pages/core/Dashboard'
import Medicines from './pages/core/Medicines'
import HealthTrack from './pages/core/HealthTrack'
import Profile from './pages/core/Profile'
import MentalHealth from './pages/core/MentalHealth'
import Lifestyle from './pages/core/Lifestyle'
import Insurance from './pages/core/Insurance'
import Prescriptions from './pages/core/Prescriptions'
import PastRecords from './pages/core/PastRecords'
import VerifyOTP from './pages/auth/VerifyOTP'
import Landing from './pages/Landing'
import AddMedicine from './pages/forms/AddMedicine'
import AddHealthRecord from './pages/forms/AddHealthRecord'
import AddPrescription from './pages/forms/AddPrescription'
import Chatbot from './components/Chatbot'
import DoctorDashboard from './pages/core/DoctorDashboard'
import ProviderDashboard from './pages/core/ProviderDashboard'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* Core Features */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/health-track" element={<HealthTrack />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mental-health" element={<MentalHealth />} />
        <Route path="/lifestyle" element={<Lifestyle />} />
        <Route path="/insurance" element={<Insurance />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/past-records" element={<PastRecords />} />

        {/* Forms */}
        <Route path="/add-medicine" element={<AddMedicine />} />
        <Route path="/add-health-record" element={<AddHealthRecord />} />
        <Route path="/add-prescription" element={<AddPrescription />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  </React.StrictMode>
)
