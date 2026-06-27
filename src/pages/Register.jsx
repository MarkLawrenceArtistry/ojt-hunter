import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// SERVICES/API
import { register } from "../services/users";

export default function Register() {
    const [credentials, setCredentials] = useState({ email: '', password: '', name: '', campus_id: '', program_course: '' })
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false) // Added state for the modal
    const navigate = useNavigate()

    // Form submission only opens the modal now
    const handleSubmit = (e) => {
        e.preventDefault()
        setShowModal(true)
    }

    // Actual API call triggers here after agreeing to the privacy notice
    const handleConfirmRegistration = async () => {
        setShowModal(false) // Close the modal
        setLoading(true)

        try {
            const response = await register(credentials)

            if(response) {
                alert('Register successful! Kindly check your email.')
                navigate('/')
            }
        } catch(err) {
            alert(`[ERROR] - ${err.message}`)
            console.error(err.message)
        } finally {
            setLoading(false)
            clearFields()
        }
    }

    const clearFields = () => {
        setCredentials({ email: '', password: '', name: '', campus_id: '', program_course: '' })
    }

    return (
        <div className="bg-[#171717] text-white min-h-screen flex items-center justify-center relative">
            
            {/* Main Form Box */}
            <div className="bg-[#1f1f1f] pt-10 pb-10 pl-5 pr-5 rounded z-10 w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div>
                        <div>
                            <p className="text-xs text-[#a8b2b0] mb-2">OJT Hunter App </p>
                            <h1 className="text-4xl mb-2">Register Student</h1>
                            <p className="text-[#a8b2b0] mb-5">Fill in your credentials to create account. {loading ? 'Loading, please wait...' : ''}</p>
                        </div>

                        <div className="flex flex-col gap-1 mb-3">
                            <input className="w-full bg-[#393939] border border-[#1f1f1f] p-2 rounded" type="email" placeholder="Email..." value={credentials.email} onChange={(e) => setCredentials({...credentials, email: e.target.value})} required disabled={loading} />

                            <input className="w-full bg-[#393939] border border-[#1f1f1f] p-2 rounded" type="password" placeholder="Password..." value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} required disabled={loading} />

                            <input className="w-full bg-[#393939] border border-[#1f1f1f] p-2 rounded" type="text" placeholder="Name..." value={credentials.name} onChange={(e) => setCredentials({...credentials, name: e.target.value})} required disabled={loading} />

                            <input className="w-full bg-[#393939] border border-[#1f1f1f] p-2 rounded" type="number" placeholder="Campus ID: 1 - CALOOCAN, 2 - VALENZUELA" value={credentials.campus_id} onChange={(e) => setCredentials({...credentials, campus_id: e.target.value})} required disabled={loading} />

                            <input className="w-full bg-[#393939] border border-[#1f1f1f] p-2 rounded" type="text" placeholder="Program/Course..." value={credentials.program_course} onChange={(e) => setCredentials({...credentials, program_course: e.target.value})} required disabled={loading} />
                        </div>

                        <div>
                            <button className="w-full bg-[#006339] border-2 border-[#1c6948] hover:bg-[#00844d] hover:border-[#209160] rounded p-2 transition-colors disabled:opacity-50" type="submit" disabled={loading}>
                                Register
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Data Privacy Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
                    <div className="bg-[#1f1f1f] border border-[#393939] rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl">
                        
                        <h2 className="text-3xl font-semibold mb-4 text-white">Data Privacy Notice</h2>
                        
                        <div className="text-[#a8b2b0] space-y-4 text-sm md:text-base leading-relaxed">
                            <p>
                                In compliance with <strong className="text-white">Republic Act No. 10173</strong>, also known as the <strong className="text-white">Data Privacy Act of 2012 (DPA)</strong>, this website is committed to protecting and securing your personal information. We adhere strictly to the core principles mandated by the National Privacy Commission (NPC):
                            </p>
                            
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong className="text-white">Transparency:</strong> We will always inform you about why and how your data is collected, used, and stored.</li>
                                <li><strong className="text-white">Legitimate Purpose:</strong> Your data will only be processed for specific, declared, and lawful reasons compatible with our services.</li>
                                <li><strong className="text-white">Proportionality:</strong> We only collect data that is strictly necessary for our website's functionality—nothing excessive.</li>
                            </ul>

                            <h3 className="text-xl font-medium text-white pt-2">Your Rights as a Data Subject</h3>
                            
                            <p>
                                Under the DPA, you retain full ownership of your data and are entitled to the following rights:
                            </p>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li><strong className="text-white">Right to be Informed:</strong> Knowing if, how, and why your data is being processed.</li>
                                <li><strong className="text-white">Right to Access:</strong> Requesting a copy of the personal data we hold about you.</li>
                                <li><strong className="text-white">Right to Object:</strong> Refusing the processing of your data under certain conditions.</li>
                                <li><strong className="text-white">Right to Rectification:</strong> Requesting corrections to any inaccurate or outdated information in our system.</li>
                                <li><strong className="text-white">Right to Erasure or Blocking:</strong> Requesting the suspension, withdrawal, or removal of your personal data from our storage.</li>
                            </ol>

                            <hr className="border-[#393939] my-4" />

                            <p>
                                For a complete and more extensive breakdown of the official law, your rights, and how organizations must handle your information, please read the full text of the statutory act on the <a href="https://privacy.gov.ph/data-privacy-act/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Official National Privacy Commission Portal</a>.
                            </p>
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3">
                            <button 
                                type="button"
                                className="w-full sm:w-auto px-6 py-2 rounded bg-transparent border border-[#393939] hover:bg-[#393939] text-[#a8b2b0] hover:text-white transition-colors"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                type="button"
                                className="w-full sm:w-auto px-6 py-2 rounded bg-[#006339] border-2 border-[#1c6948] hover:bg-[#00844d] hover:border-[#209160] text-white transition-colors font-medium"
                                onClick={handleConfirmRegistration}
                            >
                                I Agree & Register
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}