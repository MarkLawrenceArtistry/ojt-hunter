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
                alert("Login successful")
                navigate('/admin-dashboard')
            } else if((role === 'student')) {
                alert("Login successful")
                navigate('/dashboard')
            }
        }
    }, [user, role, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)

        try {
            const response = await login(credentials)
        } catch(err) {
            alert(`Invalid credentials: ${err.message}`)
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-[#171717] text-white min-h-screen flex items-center justify-center">
            <div className="bg-[#1f1f1f] pt-10 pb-10 pl-5 pr-5 rounded">
                <form onSubmit={handleSubmit}>
                    <div>
                        <div>
                            <p className="text-xs text-[#a8b2b0] mb-2">OJT Hunter App </p>
                            <h1 className="text-4xl mb-2">Login</h1>
                            <p className="text-[#a8b2b0] mb-5">Log in your credentials to access the system. {loading ? 'Loading, please wait...' : ''}</p>
                        </div>
                        <div className="flex flex-col gap-1 mb-3">
                            <input className="w-full bg-[#393939] border border-[#1f1f1f] p-2 rounded" type="email" placeholder="Email.." value={credentials.email} onChange={(e) => setCredentials({...credentials, email: e.target.value})} required />
                            <input className="w-full bg-[#393939] border border-[#1f1f1f] p-2 rounded" type="password" placeholder="Password.." value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} required />
                        </div>
                        <button className="w-full bg-[#006339] border-2 border-[#1c6948] hover:bg-[#00844d] hover:border-[#209160] rounded p-2 transition-colors" type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}