import { useNavigate, Navigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useState } from "react";


export default function AdminDashboard() {
    const navigate = useNavigate()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <aside
                className={`flex flex-col fixed inset-y-0 left-0 z-50 w-64 bg-[#171717] border-3 border-[#2a2a2a] p-5 text-white transition-transform md:relative md:translate-x-0 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-0 justify-between mb-5">
                    <span className="text-2xl font-bold">OJT Hunter</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
                        [X]
                    </button>
                </div>

                <nav className="cursor-pointer flex flex-1 flex-col gap-3">
                    <div className='p-2 rounded bg-[#1f1e1f] hover:bg-[#333133]' onClick={() => navigate('/admin-dashboard')}>Dashboard</div>
                    <div className='p-2 rounded bg-[#1f1e1f] hover:bg-[#333133]' onClick={() => navigate('/admin-job-listings')}>Job Listings</div>
                    <div className='p-2 rounded bg-[#1f1e1f] hover:bg-[#333133]' onClick={() => navigate('/admin-students')}>Students</div>
                </nav>

                <div className='cursor-pointer flex-0 p-2 rounded hover:bg-[#333133]' onClick={handleLogout}>Logout</div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 bg-[#171717] text-white p-5">
                <header className="flex bg-[#1f1e1f] p-3">
                    <button onClick={() => setIsSidebarOpen(true)} className="md:hidden">
                        [Menu]
                    </button>
                    <h1 className="text-4xl font-bold">Dashboard Overview</h1>
                </header>

                <main className="flex-1 overflow-y-auto p-3">
                    <p>Welcome to dashboard.</p>
                </main>
            </div>
        </div>
    )
}