import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/Home';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import Sidebar from './components/Sidebar';
import JobSearch from './pages/JobSearch';
import DashboardPage from './pages/Dashboard';
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './protectedRoute';
import ScanEmailsPage from './pages/ScanEmails';
import Applications from './pages/Applications';
import Heatmap from './components/Heatmap';
import Loader from './components/Loader';
import Notifications from './pages/Notifications';
import Resume from './pages/Resume';
import Profile from './pages/Profile';

export default function App() {
 
  return (
   <BrowserRouter>
   <AuthProvider>
   <Routes>
<Route path="/" element={<HomePage />}/>
<Route path="/login" element={<LoginPage />}/>
<Route path="/signup" element={<SignupPage />}/>
<Route path="/dashboard" element={<ProtectedRoute> <DashboardPage /> </ProtectedRoute>}/>
<Route path="/job-search" element={<ProtectedRoute> <JobSearch /> </ProtectedRoute>}/>
<Route path="/scan" element={<ProtectedRoute> <ScanEmailsPage /> </ProtectedRoute>}/>
<Route path="/applications" element={<ProtectedRoute> <Applications/> </ProtectedRoute>}/>
<Route path="/heatmap" element={<Heatmap /> }/>
<Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
<Route path="/resume"        element={<ProtectedRoute><Resume /></ProtectedRoute>} />
<Route path="/profile"       element={<ProtectedRoute><Profile /></ProtectedRoute>} />
</Routes>
</AuthProvider>
   </BrowserRouter>
  )
}



