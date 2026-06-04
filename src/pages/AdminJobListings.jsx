import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useEffect, useState } from "react";

import { getAllJobListingsAdmin, deleteJobListing, createJobListing } from "../services/job-listings";
import { useAuth } from "../contexts/AuthContext";

export default function AdminJobListings() {
    const { user } = useAuth()

    const [listings, setListings] = useState([])
    const [currentListing, setCurrentListing] = useState({ title: '', company: '', apply_url: '', description: '', created_by: user.id })
    const [formState, setFormState] = useState(1) 
    const navigate = useNavigate()

    const fetchJobListings = async () => {
        const response = await getAllJobListingsAdmin()
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

    const handleSubmit = async (e) => {
        e.preventDefault()

        let listingDescription = currentListing.description && currentListing.description.trim();
        if (listingDescription === "") {
            listingDescription = null;
        }
        setCurrentListing({...currentListing, description: listingDescription})
        console.log(currentListing)

        try {

            // if new data
            // 1 = NEW, 2 = UPDATE
            if(formState === 1) {
                const response = await createJobListing(currentListing)
                alert(`Job listing created successfully. ${response}`)
            } else {
                // later
                setFormState(2)
                return
            }

            fetchJobListings()
            handleClearFields()

        } catch(err) {
            console.error(`Error creating/updating job listing: ${err.message}`)
            alert(`Failed to create/update job listing!`)
        }
    }

    const handleClearFields = () => {
        setCurrentListing({ title: '', company: '', apply_url: '', description: '', created_by: user.id })
    }

    return (
        <div>
            <div>
                <h1>Welcome to Admin Job Listings.</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <div>
                <div>
                    <form onSubmit={handleSubmit}>
                        <h1>{formState === 1 ? "Add new listing" : "Update listing"}</h1>

                        <label>Title</label>
                        <input type="text" placeholder="IT Intern" value={currentListing.title} onChange={(e) => setCurrentListing({...currentListing, title: e.target.value})} required /> <br />

                        <label>Company</label>
                        <input type="text" placeholder="Apple Inc." value={currentListing.company} onChange={(e) => setCurrentListing({...currentListing, company: e.target.value})} required /> <br />

                        <label>URL</label>
                        <input type="text" placeholder="apple.com" value={currentListing.apply_url} onChange={(e) => setCurrentListing({...currentListing, apply_url: e.target.value})} required /> <br />

                        <label>Description</label>
                        <input type="text" placeholder="Apple Inc. is currrently looking for..." value={currentListing.description} onChange={(e) => setCurrentListing({...currentListing, description: e.target.value})} required /> <br />

                        <button type="submit">Submit</button>
                    </form>
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
        </div>
    )
}