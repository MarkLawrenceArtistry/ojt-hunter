import { supabase } from "../services/supabase";

export default function Dashboard() {
    return (
        <div>
            <h1>Welcome to Dashboard.</h1>
            <button onClick={() => {
                supabase.auth.signOut()
                window.location.href = "/"
            }}>Logout</button>
        </div>
    )
}