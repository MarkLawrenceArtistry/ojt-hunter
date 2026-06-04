import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useEffect, useState } from "react";

import { getAllStudents } from "../services/users";
import { useAuth } from "../contexts/AuthContext";

export default function AdminJobListings() {
    const [students, setStudents] = useState([])

    const fetchStudents = async () => {
        const response = await getAllStudents()
        setStudents(response)
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }


    return (
        <div>
            <h1>Welcome to Admin Students.</h1>
            <button onClick={handleLogout}>Logout</button>
            
            <br />
            
            <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ backgroundColor: '#eee' }}>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Campus ID</th>
                        <th>Program Course</th>
                        <th>Created at</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {students.length === 0 ? (
                        <tr style={{ textAlign: 'center' }}>
                            <td colSpan='8'>No students yet. Create one above!</td>
                        </tr>
                    ) : (
                        students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{student.role}</td>
                                <td>{student.email}</td>
                                <td>{student.campus_id === '1' ? 'CALOOCAN' : 'VALENZUELA'}</td>
                                <td>{student.program_course}</td>
                                <td>{student.created_at}</td>
                                <td>
                                    <div>
                                        {/* <button onClick={() => handleDelete(student.id)}>Delete</button> */}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}