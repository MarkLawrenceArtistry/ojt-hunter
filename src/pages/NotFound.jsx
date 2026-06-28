import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="bg-[#171717] text-white min-h-screen flex flex-col items-center justify-center p-5 text-center">
            <h1 className="text-9xl font-bold text-[#393939] mb-4">404</h1>
            <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
            <p className="text-[#a8b2b0] mb-8 max-w-md">
                Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link 
                to="/" 
                className="bg-[#006339] border-2 border-[#1c6948] hover:bg-[#00844d] hover:border-[#209160] px-6 py-3 rounded transition-colors font-medium text-white"
            >
                Return to Home
            </Link>
        </div>
    );
}