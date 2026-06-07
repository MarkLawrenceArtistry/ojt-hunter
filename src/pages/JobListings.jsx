import { useState, useEffect } from "react";
import { getAllJobListingsAdmin } from "../services/job-listings";
import { useAuth } from "../contexts/AuthContext";

export default function JobListings() {
    const [listings, setListings] = useState([])

    const {user, role} = useAuth()

    const fetchJobListings = async () => {
        const response = await getAllJobListingsAdmin()
        console.log(response + listings)
        setListings(response)
    }

    useEffect(() => {
        fetchJobListings()
    }, [])

    return (
        <div>
            <div>
                <h1>Welcome to Job Listings, {role}</h1>
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
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}