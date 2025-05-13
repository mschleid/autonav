import axios from 'axios';

const API_URL = "*** API BASE ADDRESS GOES HERE ***";



/* Users */



export const userGetMe = async () => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.get(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return false;
    }
};

export const userUpdateMe = async (parameters) => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.patch(
            `${API_URL}/users/me`,
            parameters,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.status);
    }
};

export const usersGetAll = async () => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.get(`${API_URL}/users/all`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.status);
    }
};

export const userUpdatePasswordMe = async (current_password, new_password) => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.post(
            `${API_URL}/users/me/password`,
            {
                current_password,
                new_password
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.status);
    }
};

export const userUpdate = async (id, username, first_name, last_name, email, role, disabled) => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.patch(
            `${API_URL}/tags/${id}`,
            {
                username,
                first_name,
                last_name,
                email,
                role,
                disabled
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.status);
    }
};

export const userCreate = async (username, first_name, last_name, email, role, disabled, password) => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.post(
            `${API_URL}/users`,
            {
                username,
                first_name,
                last_name,
                email,
                role,
                disabled,
                password
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.status);
    }
};

export const userDelete = async (id) => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.delete(
            `${API_URL}/users/${id}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.status);
    }
};



/* Tags */



export const tagsGetAll = async () => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.get(`${API_URL}/tags/all`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.status);
    }
};

export const tagUpdate = async (id, name, address) => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.patch(
            `${API_URL}/tags/${id}`,
            {
                name,
                address
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.status);
    }
};

export const tagCreate = async (name, address) => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.post(
            `${API_URL}/tags`,
            {
                name,
                address
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.status);
    }
};

export const tagDelete = async (id) => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.delete(
            `${API_URL}/tags/${id}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.status);
    }
};




/* Waypoints */



export const waypointsGetAll = async () => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.get(`${API_URL}/waypoints/all`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.status);
    }
};

export const waypointUpdate = async (id, name, pos_x, pos_y) => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.patch(
            `${API_URL}/waypoints/${id}`,
            {
                name,
                pos_x,
                pos_y
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.status);
    }
};

export const waypointUpdatePosition = async (id, pos_x, pos_y) => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.patch(
            `${API_URL}/waypoints/${id}/position`,
            {
                pos_x,
                pos_y
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.status);
    }
};

export const waypointCreate = async (name, pos_x, pos_y) => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.post(
            `${API_URL}/waypoints`,
            {
                name,
                pos_x,
                pos_y
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.status);
    }
};

export const waypointDelete = async (id) => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.delete(
            `${API_URL}/waypoints/${id}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.status);
    }
};




/* Anchors */



export const anchorsGetAll = async () => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.get(`${API_URL}/anchors/all`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.status);
    }
};

export const anchorUpdate = async (id, name, address, height, pos_x, pos_y) => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.patch(
            `${API_URL}/anchors/${id}`,
            {
                name,
                address,
                height,
                pos_x,
                pos_y
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.status);
    }
};

export const anchorUpdatePosition = async (id, pos_x, pos_y) => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.patch(
            `${API_URL}/anchors/${id}/position`,
            {
                pos_x,
                pos_y
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.status);
    }
};

export const anchorCreate = async (name, address, height, pos_x, pos_y) => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.post(
            `${API_URL}/anchors`,
            {
                name,
                address,
                height,
                pos_x,
                pos_y
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.status);
    }
};

export const anchorDelete = async (id) => {
    try {
        const token = localStorage.getItem('t');
        const response = await axios.delete(
            `${API_URL}/anchors/${id}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.status);
    }
};