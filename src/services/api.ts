import axios from "axios";

const showToast = (
    message: string,
    type: "success" | "error" = "success"
) => {
    window.dispatchEvent(
        new CustomEvent("app-toast", {
            detail: { message, type },
        })
    );
};

const api = axios.create({
    baseURL: "https://portfoliobackend-production-1c0b.up.railway.app/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        const method = response.config.method?.toLowerCase();
        const url = response.config.url || "";

        if (method === "post") {
            if (url.includes("/auth/register")) {
                showToast("Account created successfully");
            } else if (url.includes("/auth/login")) {
                showToast("Login successful");
            } else {
                showToast("Created successfully");
            }
        } else if (method === "put") {
            showToast("Updated successfully");
        } else if (method === "delete") {
            showToast("Deleted successfully");
        }

        return response;
    },
    (error) => {
        let message = "Something went wrong";

        if (error.response?.data?.message) {
            message = error.response.data.message;
        } else if (error.response?.status === 401) {
            message = "Unauthorized. Please login.";
        } else if (error.response?.status === 403) {
            message = "You don't have permission.";
        } else if (error.response?.status === 404) {
            message = "Resource not found.";
        } else if (error.response?.status === 409) {
            message = "This data already exists.";
        } else if (error.response?.status >= 500) {
            message = "Server error. Please try again.";
        }

        showToast(message, "error");

        return Promise.reject(error);
    }
);

export default api;
