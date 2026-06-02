import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabase";

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, role, loading } = useAuth()

    if(loading) {
        return <h2 style={{ padding: "50px" }}>Loading access rights...</h2>
    }

    if(!user) {
        return <Navigate to="/" replace />
    }

    if(!role) {
        return (
            <div>
                <h2>Database Error: Missing Role!</h2>
                <p>Your user account is valid, but something is wrong</p>
                <button onClick={() => {
                    supabase.auth.signOut()
                    window.location.href = "/"
                }}>Logout</button>
            </div>
        )
    }

    if(allowedRoles && !allowedRoles.includes(role)) {
        return (
            <div>
                <h2>Unauthorized</h2>
                <p>Your role is {role}. You need one of these roles: {allowedRoles.join(', ')}</p>
            </div>
        )
    }

    return children
}