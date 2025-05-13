import axios from 'axios';

const API_URL = "*** API BASE URL ***"; // Replace with your actual API base URL

export const login = async (u, p) => {
    try {
        const response = await axios.post(
            `${API_URL}/token`,

            {
                'username': u,
                'password': p,
                'grant_type': "password"
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );
        if (response.data && response.data.access_token) {
            localStorage.setItem('t', response.data.access_token);
            return response.data;
        }
    } catch (error) {
        throw new Error(error.status);
    }
};

// To check if the token is valid, returns /users/me
export const isAuthenticated = async () => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.get(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};