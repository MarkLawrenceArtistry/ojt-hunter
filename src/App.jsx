import { Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'

import Register from './pages/Register'
import Login from './pages/Login'

import './App.css'


function App() {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Login/>} />
                <Route path='/register' element={<Register/>} />
            </Routes>
        </div>
    )
}

export default App
