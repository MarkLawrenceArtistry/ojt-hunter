import { useState, useEffect } from "react";
import { addBookmark, getAllJobListingsAdmin } from "../services/job-listings";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function JobListings() {
    const [listings, setListings] = useState([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState(null)
    const {user, role} = useAuth()

    const fetchJobListings = async () => {
        try {
            const response = await getAllJobListingsAdmin()
            console.log(response + listings)
            setListings(response)
        } catch(err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    const handleBookmark = async (id) => {
        try {
            const newBookmark = {
                student_id: user.id,
                job_id: id
            }

            const response = await addBookmark(newBookmark)
            alert('Added bookmark successfully.')
        } catch(err) {
            alert(`[ERROR] Adding bookmark: ${err}`)
            console.error(err)
        }
    }

    useEffect(() => {
        fetchJobListings()
    }, [])

    if(loading) return <p>Loading, please wait..</p>

    return (
        <div>
            <div>
                <h1>Welcome to Job Listings, {role}</h1>
                <button onClick={() => navigate('/bookmarks')}>Go to Bookmarks</button>
                <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <div>
                <div className="listings-container">
                    {/* Naka wrap sa parenthesis if gusto mo mag return or mag output ng something */}
                    {listings.length === 0 ? (
                        <div>No job listing posted yet!</div>
                    ) : (
                        listings.map((listing) => (
                            <div key={listing.id}>
                                <h1>{listing.title}</h1>
                                <p>{listing.company}</p>
                                <a target="_blank" href={"https://" + listing.apply_url} rel="noreferrer">Click here</a>

                                <br />

                                <p>{listing.description}</p>

                                <br />

                                <div>
                                    <button onClick={() => handleBookmark(listing.id)}>Save this job</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}