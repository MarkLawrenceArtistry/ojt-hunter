import { useState, useEffect } from "react";
import { deleteBookmark, getAllBookmarks, getJobListing } from "../services/job-listings";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Bookmarks() {
    const {user} = useAuth()
    const navigate = useNavigate()
    const [bookmarks, setBookmarks] = useState([])
    const [listings, setListings] = useState([])
    const [loading, setLoading] = useState(null)

    const fetchBookmarks = async () => {
        try {
            const response = await getAllBookmarks(user.id)
            setBookmarks(response)

            await displayJobsViaBookmarks(response)
        } catch(err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const displayJobsViaBookmarks = async (currentBookmarks) => {
        const promises = currentBookmarks.map(async (bookmark) => {
            return await getJobListing(bookmark.job_id)
        })

        const allListings = await Promise.all(promises)
        setListings(allListings)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    const handleDelete = async (id) => {
        if(confirm('Are you sure you want to delete this bookmark?')) {
            const response = await deleteBookmark(id)
            fetchBookmarks()
        }
    }

    useEffect(() => {
        fetchBookmarks()
    }, [])


    if(loading) return <p>Loading, please wait...</p>

    return (
        <div>
            <div>
                <h1>Welcome to Bookmarks</h1>

                <button onClick={() => navigate('/job-listings')}>Go to Job Listings</button>
                <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <div>
                <div className="bookmarks-container">
                    {bookmarks.length === 0 ? (
                        <div>No job bookmark posted yet!</div>
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
                                    <button onClick={() => handleDelete(listing.id)}>Remove this bookmark</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}