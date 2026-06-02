import { Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'

import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

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
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </AuthProvider>
    )
}

export default App
