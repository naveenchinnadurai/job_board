import axios from "axios";


const api = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use((config) => {
        const token = JSON.parse(localStorage.getItem('tokens') || '{}');
        if (token) {
            config.headers.Authorization = `Bearer ${token.accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api