import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        async function loadUserAndRole() {
            try {
                const { data: { user }, error: authError } = await supabase.auth.getUser()

                if(authError || !user) {
                    if(mounted) {
                        setUser(null)
                        setRole(null)
                        setLoading(false)
                    }

                    return
                }

                if(mounted) {
                    setUser(user)
                }

                const { data, error: roleError } = await supabase.from('users').select('role').eq('id', user.id).maybeSingle()

                if(roleError) {
                    console.error(`[ERROR] Database role error: ${roleError}`)
                }

                if(mounted) {
                    setRole(data?.role || null)
                }
            } catch(err) {
                console.error(`[ERROR] Critical auth crash: ${err}`)
            } finally {
                if(mounted) {
                    setLoading(false)
                }
            }
        }

        loadUserAndRole()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if(event === 'SIGNED_IN') {
                loadUserAndRole()
            } else if(event === 'SIGNED_OUT') {
                setUser(null)
                setRole(null)
                setLoading(false)
            }
        })

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, role, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)