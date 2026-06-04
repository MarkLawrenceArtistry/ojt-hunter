import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useEffect, useState } from "react";

import { getAllJobListingsAdmin, deleteJobListing } from "../services/job-listings";

export default function AdminJobListings() {
    const [listings, setListings] = useState([])
    const navigate = useNavigate()

    const fetchJobListings = async () => {
        const response = await getAllJobListingsAdmin()
        console.log(response)
        setListings(response)
    }

    useEffect(() => {
        fetchJobListings()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    const handleDelete = async (id) => {
        if(confirm('Are you sure you want to delete this listing?')) {
            const response = await deleteJobListing(id)
            fetchJobListings()
        }
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
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {listings.length === 0 ? (
                            <tr style={{ textAlign: 'center' }}>
                                <td colSpan='8'>No job listings yet. Create one above!</td>
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
                                    <td>
                                        <div>
                                            <button onClick={() => handleDelete(listing.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}