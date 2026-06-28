import { useState, useEffect } from "react";
import { deleteBookmark, getAllBookmarks, getJobListing } from "../services/job-listings";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Bookmarks() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const [listings, setListings] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchBookmarks = async () => {
        try {
            const response = await getAllBookmarks(user.id);
            setBookmarks(response);
            await displayJobsViaBookmarks(response);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const displayJobsViaBookmarks = async (currentBookmarks) => {
        const promises = currentBookmarks.map(async (bookmark) => {
            return await getJobListing(bookmark.job_id);
        });

        const allListings = await Promise.all(promises);
        // Filter out any nulls just in case a job was deleted but bookmark remained
        const validListings = allListings.filter(job => job !== null); 
        setListings(validListings);

        // Auto-select the first job for desktop view
        if (validListings.length > 0) {
            setSelectedJob(validListings[0]);
        } else {
            setSelectedJob(null);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Prevents opening the job details when clicking the delete icon
        if (confirm('Are you sure you want to remove this bookmark?')) {
            try {
                await deleteBookmark(id);
                
                // Update local state for immediate feedback
                const updatedListings = listings.filter(listing => listing.id !== id);
                setListings(updatedListings);
                
                // Handle selected job state
                if (selectedJob?.id === id) {
                    if (updatedListings.length > 0) {
                        setSelectedJob(updatedListings[0]);
                    } else {
                        setSelectedJob(null);
                        setIsMobileModalOpen(false); // Close mobile modal if last item deleted
                    }
                }
            } catch (err) {
                alert(`[ERROR] Deleting bookmark: ${err}`);
            }
        }
    };

    const handleJobClick = (listing) => {
        setSelectedJob(listing);
        setIsMobileModalOpen(true); // Open modal on mobile/tablet
    };

    useEffect(() => {
        fetchBookmarks();
    }, []);

    if (loading) return (
        <div className="bg-[#171717] min-h-screen flex items-center justify-center text-white">
            <p>Loading bookmarks, please wait...</p>
        </div>
    );

    // Reusable component for the job details content
    const JobDetailsContent = ({ job }) => (
        <div className="p-5 md:p-8">
            <div className="border-b border-[#2a2a2a] pb-6 mb-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{job.title}</h1>
                <p className="text-lg md:text-xl text-[#a8b2b0] mb-6">{job.company}</p>
                
                <div className="flex items-center gap-4">
                    <a 
                        href={"https://" + job.apply_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-[#006339] border-2 border-[#1c6948] hover:bg-[#00844d] hover:border-[#209160] text-white px-6 py-2 rounded-lg font-medium transition-colors inline-block"
                    >
                        Apply with Company
                    </a>
                    <button 
                        onClick={(e) => handleDelete(e, job.id)}
                        className="p-2 border-2 border-[#681e12] rounded-lg text-red-400 hover:text-white hover:bg-[#712a21] hover:border-[#85382d] transition-colors flex items-center justify-center w-11 h-11"
                        title="Remove Bookmark"
                    >
                        {/* Trash Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Job details</h2>
                
                <div className="mb-6 space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-1 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                            </svg>
                            Apply Link
                        </h3>
                        <a className="text-[#73bc8f] hover:underline break-all" target="_blank" href={"https://" + job.apply_url} rel="noreferrer">
                            {job.apply_url}
                        </a>
                    </div>
                </div>
                
                <hr className="border-[#2a2a2a] my-6" />

                <div>
                    <h3 className="text-lg font-bold mb-3">Full Job Description</h3>
                    <p className="text-[#d1d5db] leading-relaxed whitespace-pre-wrap">
                        {job.description}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen overflow-hidden relative">
            
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`flex flex-col fixed inset-y-0 left-0 z-50 w-64 bg-[#171717] border-r border-[#2a2a2a] p-5 text-white transition-transform md:relative md:translate-x-0 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-0 justify-between mb-5">
                    <span className="text-2xl font-bold">OJT Hunter</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                        [X]
                    </button>
                </div>

                <nav className="cursor-pointer flex flex-1 flex-col gap-3">
                    <div className='p-2 rounded bg-[#1f1e1f] hover:bg-[#333133]' onClick={() => navigate('/dashboard')}>Dashboard</div>
                    <div className='p-2 rounded bg-[#1f1e1f] hover:bg-[#333133]' onClick={() => navigate('/job-listings')}>Job Listings</div>
                    <div className='p-2 rounded bg-[#333133] font-semibold' onClick={() => navigate('/bookmarks')}>Bookmarks</div>
                </nav>

                <div className='cursor-pointer flex-0 p-2 rounded hover:bg-[#333133]' onClick={handleLogout}>Logout</div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#171717] text-white h-screen relative">
                
                <header className="flex items-center bg-[#1f1e1f] p-4 border-b border-[#2a2a2a]">
                    <button onClick={() => setIsSidebarOpen(true)} className="md:hidden mr-4 text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold">Bookmarks</h1>
                </header>

                <main className="flex-1 flex overflow-hidden">
                    
                    {/* Left Pane: Job List */}
                    <div className="w-full lg:w-2/5 xl:w-1/3 border-r border-[#2a2a2a] flex flex-col overflow-y-auto bg-[#1a1a1a]">
                        <div className="p-4 border-b border-[#2a2a2a] bg-[#1a1a1a] sticky top-0 z-10">
                            <h2 className="font-semibold text-[#a8b2b0]">Saved Jobs</h2>
                        </div>
                        
                        <div className="flex-1 p-3 space-y-3">
                            {listings.length === 0 ? (
                                <div className="text-center text-gray-400 mt-10">No job bookmarks yet!</div>
                            ) : (
                                listings.map((listing) => (
                                    <div 
                                        key={listing.id} 
                                        onClick={() => handleJobClick(listing)}
                                        className={`p-4 border rounded-lg cursor-pointer transition-colors relative flex flex-col ${
                                            selectedJob?.id === listing.id 
                                            ? 'bg-[#252525] border-[#006339]' 
                                            : 'bg-[#1f1f1f] border-[#2a2a2a] hover:border-gray-500'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="pr-8">
                                                <h3 className="text-lg font-bold leading-tight">{listing.title}</h3>
                                                <p className="text-[#a8b2b0] text-sm mt-1">{listing.company}</p>
                                            </div>
                                            
                                            <button 
                                                onClick={(e) => handleDelete(e, listing.id)}
                                                className="absolute top-4 right-4 text-red-500 hover:text-red-400 transition-colors"
                                                title="Remove bookmark"
                                            >
                                                {/* Filled Bookmark SVG to imply it's saved */}
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                  <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Pane: Job Details (Visible ONLY on Desktop 'lg' breakpoint) */}
                    <div className="hidden lg:flex lg:w-3/5 xl:w-2/3 flex-col overflow-y-auto bg-[#171717]">
                        {selectedJob ? (
                            <JobDetailsContent job={selectedJob} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <p>Select a saved job to view details</p>
                            </div>
                        )}
                    </div>
                </main>

                {/* Mobile Modal for Job Details (Visible ONLY on Mobile/Tablet when a job is clicked) */}
                {isMobileModalOpen && selectedJob && (
                    <div className="absolute inset-0 z-40 bg-[#171717] flex flex-col lg:hidden overflow-y-auto">
                        <div className="flex items-center p-4 border-b border-[#2a2a2a] sticky top-0 bg-[#1f1e1f] z-50">
                            <button 
                                onClick={() => setIsMobileModalOpen(false)}
                                className="flex items-center text-[#a8b2b0] hover:text-white font-medium"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                </svg>
                                Back to saved jobs
                            </button>
                        </div>
                        <div className="flex-1">
                            <JobDetailsContent job={selectedJob} />
                        </div>
                    </div>
                )}
                
            </div>
        </div>
    );
}