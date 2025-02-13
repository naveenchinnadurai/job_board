import axios from "axios";
import { JobType } from "./types";


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

export const fetchJobs = async (id: string, type: string): Promise<JobType[] | undefined> => {
    try {
        if (type == "employee") {
            const response = await api.get('http://localhost:5000/api/v1/job',)
            if (response.status) {
                localStorage.setItem('jobs', JSON.stringify(response.data))
                return response.data;
            }
        } else if (type == "employer") {
            const response = await api.get(`http://localhost:5000/api/v1/job/${id}`,)
            if (response.status) {
                localStorage.setItem('jobs', JSON.stringify(response.data))
                return response.data;
            }
        }
    } catch (error: any) {
        console.log("error")
    }
}

export default api