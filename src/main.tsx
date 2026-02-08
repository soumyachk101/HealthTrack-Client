import React from 'react'
import ReactDOM from 'react-dom/client'
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

const rootElement = document.getElementById('root')

if (rootElement) {
  const page = rootElement.getAttribute('data-page')
  const root = ReactDOM.createRoot(rootElement)

  let Component: React.ComponentType = () => <div className="p-10 text-center text-red-500">Page Not Found: {page}</div>

  switch (page) {
    case 'Landing':
      Component = Landing
      break;
    case 'Login':
    case 'Register':
      Component = Auth
      break;
    case 'Dashboard':
      Component = Dashboard
      break;
    case 'DoctorDashboard':
      Component = DoctorDashboard
      break;
    case 'ProviderDashboard':
      Component = ProviderDashboard
      break;
    case 'Medicines':
      Component = Medicines
      break;
    case 'HealthTrack':
      Component = HealthTrack
      break;
    case 'Profile':
      Component = Profile
      break;
    case 'MentalHealth':
      Component = MentalHealth
      break;
    case 'Lifestyle':
      Component = Lifestyle
      break;
    case 'Insurance':
      Component = Insurance
      break;
    case 'Prescriptions':
      Component = Prescriptions
      break;
    case 'PastRecords':
      Component = PastRecords
      break;
    case 'VerifyOTP':
      Component = VerifyOTP
      break;
    case 'AddMedicine':
      Component = AddMedicine
      break;
    case 'AddHealthRecord':
      Component = AddHealthRecord
      break;
    case 'AddPrescription':
      Component = AddPrescription
      break;
    default:
      console.warn(`No component found for page: ${page}`)
      break;
  }

  if (page) {
    root.render(
      <React.StrictMode>
        <Component />
        <Chatbot />
      </React.StrictMode>
    )
  }
}
