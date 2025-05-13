import { Sheet } from "@mui/joy";
import React from "react";
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import Map from './Map';

const Home = (props) => {

    const navigate = useNavigate();

    const loadData = async (params) => {
        const cu = await isAuthenticated();

        if (cu === null) {
            navigate('/login?redirect=expiredToken');
        }
    };

    // On load
    React.useEffect(() => {
        loadData();
    }, []);

    return (
        <Sheet>
            <Map />
        </Sheet>
    );
};

export default Home;