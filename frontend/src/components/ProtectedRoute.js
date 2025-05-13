import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

const ProtectedRoute = ({ children }) => {
    const [auth, setAuth] = React.useState(null);

    React.useEffect(() => {
        const checkAuth = async () => {
            const isLoggedIn = await isAuthenticated();
            setAuth(isLoggedIn);
        };
        checkAuth();
    }, []);

    if (auth === null) return <div>Loading...</div>;  // Loading state until we know

    return auth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
