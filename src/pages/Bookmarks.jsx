import { useState, useEffect } from "react";
import { deleteBookmark, getAllBookmarks, getJobListing } from "../services/job-listings";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Bookmarks() {
    const {user} = useAuth()
    const navigate = useNavigate()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
                    <div className='p-2 rounded bg-[#1f1e1f] hover:bg-[#333133]' onClick={() => navigate('/dashboard')}>Dashboard</div>
                    <div className='p-2 rounded bg-[#1f1e1f] hover:bg-[#333133]' onClick={() => navigate('/job-listings')}>Job Listings</div>
                    <div className='p-2 rounded bg-[#1f1e1f] hover:bg-[#333133]' onClick={() => navigate('/bookmarks')}>Bookmarks</div>
                </nav>

                <div className='cursor-pointer flex-0 p-2 rounded hover:bg-[#333133]' onClick={handleLogout}>Logout</div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 bg-[#171717] text-white p-5">
                <header className="flex bg-[#1f1e1f] p-3 mb-5">
                    <button onClick={() => setIsSidebarOpen(true)} className="md:hidden">
                        [Menu]
                    </button>
                    <h1 className="text-4xl font-bold">Bookmarks Overview</h1>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <div className="bookmarks-container flex flex-col gap-3">
                        {bookmarks.length === 0 ? (
                            <div>No job bookmark posted yet!</div>
                        ) : (
                            listings.map((listing) => (
                                <div className="bg-[#1f1f1f] border-2 border-[#2d2d2d] rounded p-3" key={listing.id}>
                                    <h1 className="text-2xl font-bold">{listing.title}</h1>
                                    <p className="text-[#a8b2b0] mb-3">{listing.company}</p>

                                    <p className="text-xs text-[#a8b2b0] mb-2">Original link:</p>
                                    <a className="bg-[#22312b] text-[#73bc8f] p-1 block w-25 text-center mb-2" target="_blank" href={"https://" + listing.apply_url} rel="noreferrer">Click here</a>
                                    <p className="text-[#a8b2b0] mb-4">{listing.description}</p>

                                    <div>
                                        <button className="p-2 bg-[#551c14] hover:bg-[#712a21] hover:border-[#85382d] border-2 border-[#681e12] rounded
                                        transition-colors" onClick={() => handleDelete(listing.id)}>Remove this bookmark</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}