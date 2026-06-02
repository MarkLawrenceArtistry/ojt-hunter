import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// SERVICES/API
import { login } from "../services/users";

export default function Login() {
    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(null)
    const navigate = useNavigate()
    const { user, role } = useAuth()

    useEffect(() => {
        if(user) {
            if(role === 'admin') {
                navigate('/admin-dashboard')
            } else if((role === 'student')) {
                navigate('/dashboard')
            }
        }
    }, [user, role, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await login(credentials)

            if(response) {
                alert("Login successful")
            }
        } catch(err) {
            alert(`Invalid credentials: ${err.message}`)
            console.error(err.message)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <div>
                        <h1>Login {role}</h1>
                        <p>Log in your credentials to access the system.</p>
                    </div>
                    <div>
                        <input type="email" placeholder="Email.." value={credentials.email} onChange={(e) => setCredentials({...credentials, email: e.target.value})} required />
                        <input type="password" placeholder="Password.." value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} required />
                    </div>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    )
}