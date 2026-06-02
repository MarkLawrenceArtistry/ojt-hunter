import { useNavigate } from "react-router-dom";
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
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}