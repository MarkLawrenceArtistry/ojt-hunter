import { Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'

import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminJobListings from './pages/AdminJobListings'

import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'


function App() {
    return (
        <AuthProvider>
            <div>
                <Routes>
                    <Route path='/' element={<Login/>} />
                    <Route path='/register' element={<Register/>} />

                    <Route path='/dashboard' element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    <Route path='/admin-dashboard' element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path='/admin-job-listings' element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminJobListings />
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </AuthProvider>
    )
}

export default App
