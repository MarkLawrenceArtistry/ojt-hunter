import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// SERVICES/API
import { login } from "../services/users";

export default function Login() {
    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await login(credentials)

            if(response) {
                alert("Login successful")
                navigate('/dashboard')
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
                        <h1>Login</h1>
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