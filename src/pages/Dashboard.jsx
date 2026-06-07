import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Dashboard() {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    return (
        <div>
            <h1>Welcome to Dashboard.</h1>
            <button onClick={() => navigate('/job-listings')}>Go to Job Listings</button>
            <button onClick={() => navigate('/bookmarks')}>Go to Bookmarks</button>

            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}