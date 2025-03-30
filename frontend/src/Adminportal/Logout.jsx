import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear local storage
        localStorage.clear();

        // Redirect to home or login page
        navigate('/');
    }, [navigate]); // useEffect ensures this runs only once when component mounts

    return null; // No UI needed for this component
};

export default Logout;
