import { useState, useEffect } from "react";
import { getAllBookmarks } from "../services/job-listings";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Bookmarks() {
    const [bookmarks, setBookmarks] = useState([])

    const fetchBookmarks = async () => {
        const response = await getAllBookmarks()
        setBookmarks(response)
    }

    useEffect(() => {
        fetchBookmarks()
    }, [])

    return (
        <div>
            <div>
                <h1>Welcome to Bookmarks</h1>
            </div>

            <div>
                <div className="bookmarks-container">
                    {/* Naka wrap sa parenthesis if gusto mo mag return or mag output ng something */}
                    {bookmarks.length === 0 ? (
                        <div>No job bookmark posted yet!</div>
                    ) : (
                        bookmarks.map((bookmark) => (
                            <div key={bookmark.id}>
                                <h1>{bookmark.job_id}</h1>
                                <p>{bookmark.student_id}</p>
                                <div>
                                    <button>Remove bookmark</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}