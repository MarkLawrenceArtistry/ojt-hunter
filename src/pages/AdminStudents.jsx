import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useEffect, useState } from "react";

import { deleteStudent, getAllStudents } from "../services/users";
import { useAuth } from "../contexts/AuthContext";

export default function AdminJobListings() {
    const [students, setStudents] = useState([])
    const navigate = useNavigate()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true)

    const fetchStudents = async () => {
        try {
            const response = await getAllStudents()
            setStudents(response)
        } catch(err) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    if (loading) return (
        <div className="bg-[#171717] min-h-screen flex items-center justify-center text-white">
            <p>Loading jobs, please wait...</p>
        </div>
    )

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    const handleDelete = async (id) => {
        if(confirm('Are you sure you want to delete this student?')) {
            const response = await deleteStudent(id)
            fetchStudents()
        }
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
                <header className="flex bg-[#1f1e1f] p-3 mb-5">
                    <button onClick={() => setIsSidebarOpen(true)} className="md:hidden">
                        [Menu]
                    </button>
                    <h1 className="text-4xl font-bold">Students Overview</h1>
                </header>

                <main className="flex-1 overflow-y-auto space-y-6">
                    <div className="overflow-x-auto rounded border border-[#2a2a2a]">
                        <table style={{ width: '100%', borderCollapse: "collapse" }} className="text-left">
                            <thead className="bg-[#1f1e1f] border-b border-[#2a2a2a]">
                                <tr>
                                    <th className="p-3 font-semibold text-sm">ID</th>
                                    <th className="p-3 font-semibold text-sm">Name</th>
                                    <th className="p-3 font-semibold text-sm">Role</th>
                                    <th className="p-3 font-semibold text-sm">Email</th>
                                    <th className="p-3 font-semibold text-sm">Campus ID</th>
                                    <th className="p-3 font-semibold text-sm">Program Course</th>
                                    <th className="p-3 font-semibold text-sm">Created at</th>
                                    <th className="p-3 font-semibold text-sm">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {students.length === 0 ? (
                                    <tr className="bg-[#171717]">
                                        <td colSpan='8' className="p-5 text-center text-gray-400">No job listings yet. Create one above!</td>
                                    </tr>
                                ) : (
                                    students.map((student) => (
                                        <tr className="border-b border-[#2a2a2a] last:border-0 odd:bg-[#171717] even:bg-[#1f1e1f]">
                                            <td className="p-3 text-sm">{student.id}</td>
                                            <td className="p-3 text-sm">{student.name}</td>
                                            <td className="p-3 text-sm">{student.role}</td>
                                            <td className="p-3 text-sm">{student.email}</td>
                                            <td className="p-3 text-sm">{student.campus_id === '1' ? 'CALOOCAN' : 'VALENZUELA'}</td>
                                            <td className="p-3 text-sm">{student.program_course}</td>
                                            <td className="p-3 text-sm">{student.created_at}</td>
                                            <td className="p-3 text-sm">
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleDelete(student.id)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    )
}