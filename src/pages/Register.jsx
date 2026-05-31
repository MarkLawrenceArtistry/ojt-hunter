import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// SERVICES/API
import { supabase } from "../services/supabase";
import { register } from "../services/users";

export default function Register() {
    const [credentials, setCredentials] = useState({ email: '', password: '', name: '', campus_id: '', program_course: '' })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await register(credentials)

            if(response) {
                alert('Register successful! Kindly check your email.')
                navigate('/login')
            }
        } catch(err) {
            alert(`[ERROR] - ${err.message}`)
            console.error(err.message)
        } finally {
            setLoading(false)
            clearFields()
        }
    }

    const clearFields = () => {
        setCredentials({ email: '', password: '', name: '', campus_id: '', program_course: '' })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <div>
                        <h1>Register</h1>
                        <p>Create your account.</p>
                        <p style={{ display: loading ? 'block' : 'none' }}>Loading, please wait a few seconds...</p>
                    </div>

                    <div>
                        <input type="email" placeholder="Email..." value={credentials.email} onChange={(e) => setCredentials({...credentials, email: e.target.value})} required />

                        <input type="password" placeholder="Password..." value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} required />

                        <input type="text" placeholder="Name..." value={credentials.name} onChange={(e) => setCredentials({...credentials, name: e.target.value})} required />

                        <input type="number" placeholder="Campus ID: 1 - CALOOCAN, 2 - VALENZUELA" value={credentials.campus_id} onChange={(e) => setCredentials({...credentials, campus_id: e.target.value})} required />

                        <input type="text" placeholder="Program/Course..." value={credentials.program_course} onChange={(e) => setCredentials({...credentials, program_course: e.target.value})} required />
                    </div>

                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    )
}