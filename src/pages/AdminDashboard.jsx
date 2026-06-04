import { useNavigate, Navigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function AdminDashboard() {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    return (
        <div>
            <h1>Welcome to Admin Dashboard.</h1>
            <button onClick={() => navigate('/admin-job-listings')}>Go to Job Listings</button>
            <button onClick={() => navigate('/admin-students')}>Go to Students</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}