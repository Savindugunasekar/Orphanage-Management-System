import { useEffect, useState } from 'react';
import axios from "../api/axios";
import { useNavigate, useParams } from 'react-router-dom';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState('');

    useEffect(() => {
      const url = window.location.href;
      const urlParams = new URLSearchParams(new URL(url).search);
      const tokenParam = urlParams.get('token');
      if (tokenParam) {
        setToken(tokenParam);
      }
    }, []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const verifyEmail = async () => {

        
        if (!token) return;

        setLoading(true);
        setError(null); // Reset error state before the request

        try {
            const response = await axios.get(`/verify?token=${token}`);
            if (response.status === 200) {
                console.log("Email verified successfully!");
                navigate('/login');
            }
        } catch (error) {
            console.error("Verification failed:", error.response?.data?.message || error.message);
            setError(error.response?.data?.message || 'Verification failed. Please try again later.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center mb-4">Email Verification</h1>
                {loading ? (
                    <p className="text-center text-gray-600">Verifying your email, please wait...</p>
                ) : (
                    <>
                        <p className="text-center mb-4">Please click the button below to verify your email address.</p>
                        <button 
                            onClick={verifyEmail} 
                            className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg 
                                        transition duration-300 ease-in-out hover:bg-blue-700 
                                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            disabled={loading}
                        >
                            Verify Email
                           
                        </button>
                    </>
                )}
                {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default VerifyEmail;
