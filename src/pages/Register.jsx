import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// SERVICES/API
import { register } from "../services/users";

export default function Register() {
    const [credentials, setCredentials] = useState({ email: '', password: '', name: '', campus_id: '', program_course: '' })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await register(credentials)

            if(response) {
                alert('Register successful! Kindly check your email.')
                navigate('/login')
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
        <div style={{ display: 'flex' }}>
            <form onSubmit={handleSubmit}>
                <div>
                    <div>
                        <h1>Register</h1>
                        <p>Create your account.</p>
                        <p style={{ display: loading ? 'block' : 'none' }}>Loading, please wait a few seconds...</p>
                    </div>

                    <div>
                        <input type="email" placeholder="Email..." value={credentials.email} onChange={(e) => setCredentials({...credentials, email: e.target.value})} required />

                        <input type="password" placeholder="Password..." value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} required />

                        <input type="text" placeholder="Name..." value={credentials.name} onChange={(e) => setCredentials({...credentials, name: e.target.value})} required />

                        <input type="number" placeholder="Campus ID: 1 - CALOOCAN, 2 - VALENZUELA" value={credentials.campus_id} onChange={(e) => setCredentials({...credentials, campus_id: e.target.value})} required />

                        <input type="text" placeholder="Program/Course..." value={credentials.program_course} onChange={(e) => setCredentials({...credentials, program_course: e.target.value})} required />
                    </div>

                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </div>
            </form>

            <div>
                <h2>Data Privacy Notice</h2>
                
                <p>
                    In compliance with <strong>Republic Act No. 10173</strong>, also known as the <strong>Data Privacy Act of 2012 (DPA)</strong>, this website is committed to protecting and securing your personal information. We adhere strictly to the core principles mandated by the National Privacy Commission (NPC):
                </p>
                
                <p>
                    <strong>Transparency:</strong> We will always inform you about why and how your data is collected, used, and stored.<br />
                    <strong>Legitimate Purpose:</strong> Your data will only be processed for specific, declared, and lawful reasons compatible with our services.<br />
                    <strong>Proportionality:</strong> We only collect data that is strictly necessary for our website's functionality—nothing excessive.
                </p>

                <h3>Your Rights as a Data Subject</h3>
                
                <p>
                    Under the DPA, you retain full ownership of your data and are entitled to the following rights:<br />
                    1. <strong>Right to be Informed:</strong> Knowing if, how, and why your data is being processed.<br />
                    2. <strong>Right to Access:</strong> Requesting a copy of the personal data we hold about you.<br />
                    3. <strong>Right to Object:</strong> Refusing the processing of your data under certain conditions.<br />
                    4. <strong>Right to Rectification:</strong> Requesting corrections to any inaccurate or outdated information in our system.<br />
                    5. <strong>Right to Erasure or Blocking:</strong> Requesting the suspension, withdrawal, or removal of your personal data from our storage.
                </p>

                <hr />

                <p>
                    For a complete and more extensive breakdown of the official law, your rights, and how organizations must handle your information, please read the full text of the statutory act on the <a href="https://privacy.gov.ph/data-privacy-act/" target="_blank" rel="noopener noreferrer">Official National Privacy Commission Portal</a>.
                </p>
            </div>
        </div>
    )
    
}