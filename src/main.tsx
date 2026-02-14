import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Chatbot from './components/Chatbot'

// Lazy load pages for performance
const Login = React.lazy(() => import('./pages/auth/Login'))
const Register = React.lazy(() => import('./pages/auth/Register'))
const VerifyOTP = React.lazy(() => import('./pages/auth/VerifyOTP'))
const Landing = React.lazy(() => import('./pages/LandingPage'))

const Dashboard = React.lazy(() => import('./pages/core/Dashboard'))
const DoctorDashboard = React.lazy(() => import('./pages/core/DoctorDashboard'))
const ProviderDashboard = React.lazy(() => import('./pages/core/ProviderDashboard'))
const Medicines = React.lazy(() => import('./pages/core/Medicines'))
const HealthTrack = React.lazy(() => import('./pages/core/HealthTrack'))
const Profile = React.lazy(() => import('./pages/core/Profile'))
const MentalHealth = React.lazy(() => import('./pages/core/MentalHealth'))
const Lifestyle = React.lazy(() => import('./pages/core/Lifestyle'))
const Insurance = React.lazy(() => import('./pages/core/Insurance'))
const Prescriptions = React.lazy(() => import('./pages/core/Prescriptions'))
const PastRecords = React.lazy(() => import('./pages/core/PastRecords'))

const AddMedicine = React.lazy(() => import('./pages/forms/AddMedicine'))
const AddHealthRecord = React.lazy(() => import('./pages/forms/AddHealthRecord'))
const AddPrescription = React.lazy(() => import('./pages/forms/AddPrescription'))

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
      </Suspense>
      <Chatbot />
    </BrowserRouter>
  </React.StrictMode>
)
