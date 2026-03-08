import axios, { InternalAxiosRequestConfig } from "axios";

console.log("API_BASE_URL Initializing. Env var:", process.env.NEXT_PUBLIC_API_URL);

// Base URL points to the AI Core locally on port 8000
const API_BASE_URL = "http://localhost:8000/api/v1";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add JWT and seller_id
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("jwt_token");
    const sellerId = localStorage.getItem("seller_id") || "1";

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Set seller_id in headers for RLS (Row Level Security) if needed by gateway
    if (sellerId) {
        config.headers["X-Seller-Id"] = sellerId;

        // Replace {seller_id} placeholder in URLs
        if (config.url && config.url.includes("{seller_id}")) {
            config.url = config.url.replace("{seller_id}", sellerId);
        }
    }

    return config;
});

export default api;
