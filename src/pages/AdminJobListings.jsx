import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useEffect, useState } from "react";

import { getAllJobListingsAdmin, deleteJobListing, createJobListing, getJobListing, updateJobListing } from "../services/job-listings";
import { useAuth } from "../contexts/AuthContext";

export default function AdminJobListings() {
    const { user } = useAuth()

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [listings, setListings] = useState([])
    const [currentListing, setCurrentListing] = useState({ id: '', title: '', company: '', apply_url: '', description: '', created_by: user.id })
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

        try {

            // 1 = NEW
            // 2 = UPDATE

            if(formState === 1) {
                const response = await createJobListing(currentListing)
                alert(`Job listing created successfully. ${response}`)
            } else if(formState === 2) {
                const response = await updateJobListing(currentListing)
                alert(`Job listing updated successfully. ${response}`)
            }

            fetchJobListings()
            handleClearFields()

        } catch(err) {
            console.error(`Error creating/updating job listing: ${err.message}`)
            alert(`Failed to create/update job listing!`)
        }
    }

    const handleUpdate = async (id) => {
        try {
            const listing = await getJobListing(id)
            setCurrentListing({ id: id, title: listing.title, company: listing.company, apply_url: listing.apply_url, description: listing.description })
            setFormState(2)
        } catch(err) {
            alert(`[ERROR] Getting task: ${err}`)
            console.error(err)
        }
    }

    const handleClearFields = () => {
        setCurrentListing({ id: '', title: '', company: '', apply_url: '', description: '', created_by: user.id })
    }

    const handleResetForm = () => {
        handleClearFields()
        setFormState(1)
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
                    <h1 className="text-4xl font-bold">Job Listings Overview</h1>
                </header>

                <main className="flex-1 overflow-y-auto space-y-6">
                    {/* Form Container styled with inherited styling rules */}
                    <div className="bg-[#1f1e1f] border border-[#2a2a2a] p-5 rounded max-w-xl">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <h2 className="text-2xl font-bold mb-2">{formState === 1 ? "Add new listing" : "Update listing"}</h2>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold">Title</label>
                                <input type="text" placeholder="IT Intern" value={currentListing.title} onChange={(e) => setCurrentListing({...currentListing, title: e.target.value})} required={formState === 1} className="p-2 rounded bg-[#171717] border border-[#2a2a2a] text-white focus:outline-none" />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold">Company</label>
                                <input type="text" placeholder="Apple Inc." value={currentListing.company} onChange={(e) => setCurrentListing({...currentListing, company: e.target.value})} required={formState === 1} className="p-2 rounded bg-[#171717] border border-[#2a2a2a] text-white focus:outline-none" />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold">URL</label>
                                <input type="text" placeholder="apple.com" value={currentListing.apply_url} onChange={(e) => setCurrentListing({...currentListing, apply_url: e.target.value})} required={formState === 1} className="p-2 rounded bg-[#171717] border border-[#2a2a2a] text-white focus:outline-none" />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold">Description</label>
                                <input type="text" placeholder="Apple Inc. is currently looking for..." value={currentListing.description} onChange={(e) => setCurrentListing({...currentListing, description: e.target.value})} required={formState === 1} className="p-2 rounded bg-[#171717] border border-[#2a2a2a] text-white focus:outline-none" />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button type="submit" className="p-2 px-4 rounded bg-[#171717] hover:bg-[#333133] border border-[#2a2a2a] transition-colors">Submit</button>
                                <button type="button" onClick={handleResetForm} className="p-2 px-4 rounded bg-[#171717] hover:bg-[#333133] border border-[#2a2a2a] transition-colors">Clear Fields</button>
                            </div>
                        </form>
                    </div>

                    {/* Table Container styled with inherited styling rules */}
                    <div className="overflow-x-auto rounded border border-[#2a2a2a]">
                        <table style={{ width: '100%', borderCollapse: "collapse" }} className="text-left">
                            <thead className="bg-[#1f1e1f] border-b border-[#2a2a2a]">
                                <tr>
                                    <th className="p-3 font-semibold text-sm">ID</th>
                                    <th className="p-3 font-semibold text-sm">Title</th>
                                    <th className="p-3 font-semibold text-sm">Company</th>
                                    <th className="p-3 font-semibold text-sm">Description</th>
                                    <th className="p-3 font-semibold text-sm">Apply URL</th>
                                    <th className="p-3 font-semibold text-sm">Created by</th>
                                    <th className="p-3 font-semibold text-sm">Created at</th>
                                    <th className="p-3 font-semibold text-sm">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {listings.length === 0 ? (
                                    <tr className="bg-[#171717]">
                                        <td colSpan='8' className="p-5 text-center text-gray-400">No job listings yet. Create one above!</td>
                                    </tr>
                                ) : (
                                    listings.map((listing) => (
                                        <tr key={listing.id} className="border-b border-[#2a2a2a] last:border-0 odd:bg-[#171717] even:bg-[#1f1e1f]">
                                            <td className="p-3 text-sm">{listing.id}</td>
                                            <td className="p-3 text-sm">{listing.title}</td>
                                            <td className="p-3 text-sm">{listing.company}</td>
                                            <td className="p-3 text-sm">{listing.description}</td>
                                            <td className="p-3 text-sm">
                                                <a target="_blank" href={"https://" + listing.apply_url} className="underline hover:text-gray-300">Click here</a>
                                            </td>
                                            <td className="p-3 text-sm">{listing.created_by}</td>
                                            <td className="p-3 text-sm">{listing.created_at}</td>
                                            <td className="p-3 text-sm">
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleUpdate(listing.id)} disabled={formState === 2} className="p-1 px-2 rounded bg-[#1f1e1f] hover:bg-[#333133] border border-[#2a2a2a] text-xs disabled:opacity-50 transition-colors">Update</button>
                                                    <button onClick={() => handleDelete(listing.id)} className="p-1 px-2 rounded bg-[#1f1e1f] hover:bg-[#333133] border border-[#2a2a2a] text-xs transition-colors">Delete</button>
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