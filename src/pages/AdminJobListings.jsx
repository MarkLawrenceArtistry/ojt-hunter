import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useEffect, useState } from "react";

import { getAllJobListingsAdmin } from "../services/job-listings";

export default function AdminJobListings() {
    const [listings, setListings] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchJobListings = async () => {
            const response = await getAllJobListingsAdmin()
            console.log(response)
            setListings(response)
        }

        fetchJobListings()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    return (
        <div>
            <div>
                <h1>Welcome to Admin Job Listings.</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <div>
                <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: '#eee' }}>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Company</th>
                            <th>Description</th>
                            <th>Apply URL</th>
                            <th>Created by</th>
                            <th>Created at</th>
                        </tr>
                    </thead>

                    <tbody>
                        {listings.length === 0 ? (
                            <tr colSpan='4'>
                                <td>No job listings yet. Create one!</td>
                            </tr>
                        ) : (
                            listings.map((listing) => (
                                <tr key={listing.id}>
                                    <td>{listing.id}</td>
                                    <td>{listing.title}</td>
                                    <td>{listing.company}</td>
                                    <td>{listing.description}</td>
                                    <td>
                                        <a target="_blank" href={"https://" + listing.apply_url}>Click here</a>
                                    </td>
                                    <td>{listing.created_by}</td>
                                    <td>{listing.created_at}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}